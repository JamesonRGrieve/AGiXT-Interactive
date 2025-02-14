import base64
import shutil
import asyncio
from pathlib import Path
import logging
import json
import os
import re
import platform
import uuid
import tempfile
import time
import requests
from datetime import datetime
from playwright.async_api import async_playwright
from IPython.display import Image, display
from pyzbar.pyzbar import decode
from datetime import datetime
from agixtsdk import AGiXTSDK
import soundfile as sf
from gtts import gTTS
from tqdm import tqdm
import numpy as np
import subprocess
import tempfile
import asyncio
import logging
import pyotp
import uuid
import cv2
import os
import re
import platform


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
# API configuration
EZLOCAL_API_URL = os.getenv("EZLOCAL_API_URL")


async def print_args(msg):
    for arg in msg.args:
        try:
            value = await arg.json_value()
            print("CONSOLE MESSAGE:", value)
        except Exception as e:
            # Fall back to text() if json_value() fails
            text_value = await arg.evaluate('handle => String(handle)')
            print("CONSOLE MESSAGE:", text_value)


def is_desktop():
    return not platform.system() == "Linux"


class FrontEndTest:

    def __init__(
        self,
        base_uri: str = os.getenv("AGIXT_API_URL", "http://localhost:3437"),
        features: str = "",
    ):
        self.base_uri = base_uri
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.screenshots_dir = os.path.join("test_screenshots", f"test_run_{timestamp}")
        os.makedirs(self.screenshots_dir, exist_ok=True)
        self.browser = None
        self.context = None
        self.page = None
        self.popup = None
        self.playwright = None
        self.screenshots_with_actions = []
        self.agixt = (
            AGiXTSDK(base_uri="https://api.agixt.dev") if is_desktop() else AGiXTSDK()
        )
        self.agixt.register_user(
            email=f"{uuid.uuid4()}@example.com", first_name="Test", last_name="User"
        )
        # Features are comma separated, options are:
        # - stripe
        # - email
        # - google
        if features == "":
            features = os.environ.get("features", "")
        if features == "":
            self.features = []
        elif "," in features:
            self.features = features.split(",")
        else:
            self.features = [features]
        if "," in features:
            self.features = features.split(",")
        else:
            if features != "":
                self.features = [features]

    async def take_screenshot(self, action_name, no_sleep=False):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        sanitized_action_name = re.sub(r"[^a-zA-Z0-9_-]", "_", action_name)
        screenshot_path = os.path.join(
            self.screenshots_dir, f"{timestamp}_{sanitized_action_name}.png"
        )
        logging.info(
            f"[{timestamp}] Action: {action_name} - Screenshot path: {screenshot_path}"
        )
        target = self.popup if self.popup else self.page
        logging.info(
            f"Screenshotting { 'popup' if self.popup else 'page'} at {target.url}"
        )
        if not no_sleep:
            await target.wait_for_timeout(5000)

        await target.screenshot(path=screenshot_path)

        if not os.path.exists(screenshot_path):
            raise Exception(f"Failed to capture screenshot on action: {action_name}")

        # Add screenshot and action to the list
        self.screenshots_with_actions.append((screenshot_path, action_name))

        display(Image(filename=str(screenshot_path)))
        return screenshot_path

    def create_video_report(self, max_size_mb=10):
        """
        Creates a video from all screenshots taken during the test run with Google TTS narration
        using OpenCV and FFMPEG for video processing. Adjusts framerate and compression if output exceeds size limit.

        Args:
            max_size_mb (int): Maximum size of the output video in MB. Defaults to 10.
        """
        if is_desktop():
            return None
        try:
            if not self.screenshots_with_actions:
                logging.warning("No screenshots found to create video")
                return None

            # Read first image to get dimensions
            first_img = cv2.imread(self.screenshots_with_actions[0][0])
            if first_img is None:
                logging.error(
                    f"Failed to read first screenshot: {self.screenshots_with_actions[0][0]}"
                )
                return None

            height, width = first_img.shape[:2]

            # Create temporary directory for files
            temp_dir = tempfile.mkdtemp()
            logging.info("Creating temporary directory for audio files...")

            def create_video(fps):
                """Helper function to create video at specified FPS"""
                video_path = os.path.join(temp_dir, "video_no_audio.mp4")
                fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
                total_frames = 0

                for idx, (screenshot_path, _) in enumerate(
                    self.screenshots_with_actions
                ):
                    frames_needed = int(max(all_audio_lengths[idx], 2.0) * fps)
                    img = cv2.imread(screenshot_path)
                    for _ in range(frames_needed):
                        out.write(img)
                        total_frames += 1

                out.release()
                return video_path, total_frames

            def combine_video_audio(silent_video_path, audio_path, output_path, crf=23):
                """Helper function to combine video and audio with compression"""
                subprocess.run(
                    [
                        "ffmpeg",
                        "-i",
                        silent_video_path,
                        "-i",
                        audio_path,
                        "-c:v",
                        "libx264",  # Use H.264 codec
                        "-crf",
                        str(
                            crf
                        ),  # Compression quality (18-28 is good, higher = more compression)
                        "-preset",
                        "medium",  # Encoding speed preset
                        "-c:a",
                        "aac",
                        "-b:a",
                        "128k",  # Compress audio bitrate
                        output_path,
                        "-y",
                        "-loglevel",
                        "error",
                    ]
                )

            # Create paths for our files
            # Check if ffmpeg is available first
            try:
                subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            except Exception as ffmpeg_error:
                logging.error("FFMPEG is not available. Please install FFMPEG to create video reports.")
                return None

            # Create tests directory if it doesn't exist
            tests_dir = os.path.dirname(__file__)
            logging.info(f"Using tests directory: {tests_dir}")
            os.makedirs(tests_dir, exist_ok=True)
            
            # Check if directory is writable by creating a temp file
            test_file = os.path.join(tests_dir, "test_write.tmp")
            try:
                with open(test_file, 'w') as f:
                    f.write('test')
                os.remove(test_file)
            except Exception as e:
                logging.error(f"Directory {tests_dir} is not writable: {e}")
                return None
            
            # Create video in the tests directory
            final_video_path = os.path.abspath(os.path.join(tests_dir, "report.mp4"))
            
            # Remove existing video if it exists
            if os.path.exists(final_video_path):
                try:
                    os.remove(final_video_path)
                except Exception as e:
                    logging.error(f"Could not remove existing video file: {e}")
                    return None
                    
            logging.info(f"Creating video report at: {final_video_path}")
            concatenated_audio_path = os.path.join(temp_dir, "combined_audio.wav")

            # Lists to store audio data and durations
            all_audio_data = []
            all_audio_lengths = []

            # First pass: Generate audio files and calculate durations
            logging.info("Generating audio narrations...")
            for idx, (_, action_name) in enumerate(
                tqdm(
                    self.screenshots_with_actions,
                    desc="Generating audio files",
                    unit="clip",
                )
            ):
                # Generate audio file for this action
                audio_path = os.path.join(temp_dir, f"audio_{idx}.wav")

                try:
                    # Clean up the action name for better narration
                    cleaned_action = action_name.replace("_", " ")
                    cleaned_action = re.sub(r"([a-z])([A-Z])", r"\1 \2", cleaned_action)

                    # Generate TTS audio using ezlocal with retries
                    try:
                        audio_content = None
                        retry_count = 0
                        retry_delay = 1
                        max_retries = 3
                        
                        while retry_count < max_retries and audio_content is None:
                            try:
                                # Make request following exact API schema
                                payload = {
                                    "input": cleaned_action,
                                    "model": "tts-1",
                                    "voice": "HAL9000",
                                    "language": "en"
                                }
                                logging.info(f"Making TTS request with payload: {payload}")
                                response = requests.post(
                                    f"{EZLOCAL_API_URL}/v1/audio/speech",
                                    json=payload
                                )
                                if response.status_code == 200:
                                    logging.info("Received 200 response from TTS API")
                                    try:
                                        # Response is already base64 encoded
                                        audio_content = base64.b64decode(response.text)
                                        logging.info(f"Decoded audio content length: {len(audio_content)} bytes")
                                        break
                                    except Exception as decode_error:
                                        logging.error(f"Failed to decode API response: {decode_error}")
                                        logging.error(f"Raw response: {response.text[:100]}...")
                                        raise
                                else:
                                    error_detail = response.text
                                    try:
                                        error_detail = response.json()
                                    except:
                                        pass
                                    raise Exception(f"API returned status code {response.status_code}: {error_detail}")
                            except Exception as e:
                                retry_count += 1
                                if retry_count < max_retries:
                                    logging.warning(f"TTS attempt {retry_count} failed: {e}. Retrying in {retry_delay}s...")
                                    time.sleep(retry_delay)
                                    retry_delay *= 2  # Exponential backoff
                                else:
                                    raise Exception(f"Failed after {max_retries} attempts: {e}")
                        
                        if audio_content is None:
                            raise Exception("Failed to generate audio after all retries")
                            
                    except Exception as e:
                        logging.error(f"Error generating TTS audio: {e}")
                        all_audio_lengths.append(2.0)
                        continue

                    # Write the audio data directly
                    audio_path = os.path.join(temp_dir, f"audio_{idx}.wav")
                    with open(audio_path, "wb") as audio_file:
                        audio_file.write(audio_content)
                    logging.info(f"Wrote audio file to {audio_path}")

                    # Read with a default sample rate of 44100Hz if soundfile can't detect it
                    try:
                        audio_data, sample_rate = sf.read(audio_path)
                    except Exception as e:
                        logging.warning(f"Could not read audio file with soundfile: {e}, using default settings")
                        # Use default audio settings
                        sample_rate = 44100
                        audio_data = np.frombuffer(audio_content, dtype=np.float32)
                    
                    # Read the converted WAV
                    audio_data, sample_rate = sf.read(audio_path)

                    # Add small silence padding at the end (0.5 seconds)
                    padding = int(0.5 * sample_rate)  # Use the actual sample rate
                    audio_data = np.pad(audio_data, (0, padding), mode="constant")

                    # Store audio data and sample rate
                    all_audio_data.append((audio_data, sample_rate))
                    audio_duration = len(audio_data) / sample_rate
                    all_audio_lengths.append(max(audio_duration, 2.0))

                except Exception as e:
                    logging.error(f"Error processing clip {idx}: {e}")
                    all_audio_lengths.append(2.0)
            if all_audio_data:
                # Use the sample rate from the first audio clip
                target_sample_rate = all_audio_data[0][1]

                # Resample all audio to match the first clip's sample rate if needed
                resampled_audio = []
                for audio_data, sr in all_audio_data:
                    if sr != target_sample_rate:
                        # You might need to add a resampling library like librosa here
                        # resampled = librosa.resample(audio_data, orig_sr=sr, target_sr=target_sample_rate)
                        resampled = audio_data  # Placeholder for actual resampling
                    else:
                        resampled = audio_data
                    resampled_audio.append(resampled)

                # Combine the resampled audio
                combined_audio = np.concatenate(resampled_audio)

                # Write with the correct sample rate
                sf.write(concatenated_audio_path, combined_audio, target_sample_rate)

            # Initial attempt with 30 fps and moderate compression
            initial_fps = 30
            silent_video_path, total_frames = create_video(initial_fps)
            combine_video_audio(
                silent_video_path, concatenated_audio_path, final_video_path, crf=23
            )

            # Get file size in MB
            file_size_mb = os.path.getsize(final_video_path) / (1024 * 1024)

            # If file is still too large, try increasing compression and reducing fps
            if file_size_mb > max_size_mb:
                logging.info(
                    f"Video size ({file_size_mb:.2f}MB) exceeds limit of {max_size_mb}MB. Adjusting settings..."
                )

                # First try stronger compression
                logging.info("Attempting stronger compression...")
                combine_video_audio(
                    silent_video_path, concatenated_audio_path, final_video_path, crf=28
                )
                file_size_mb = os.path.getsize(final_video_path) / (1024 * 1024)

                # If still too large, reduce fps and maintain high compression
                if file_size_mb > max_size_mb:
                    # Calculate new fps based on size ratio with some extra buffer
                    new_fps = int(
                        initial_fps * (max_size_mb / file_size_mb) * 0.85
                    )  # 15% buffer
                    new_fps = max(new_fps, 10)  # Don't go below 10 fps

                    logging.info(
                        f"Recreating video with {new_fps} fps and high compression..."
                    )
                    silent_video_path, total_frames = create_video(new_fps)
                    combine_video_audio(
                        silent_video_path,
                        concatenated_audio_path,
                        final_video_path,
                        crf=28,
                    )

            # Cleanup
            logging.info("Cleaning up temporary files...")
            shutil.rmtree(temp_dir)

            if not os.path.exists(final_video_path):
                logging.error("Video file was not created successfully")
                return None

            final_size_mb = os.path.getsize(final_video_path) / (1024 * 1024)
            logging.info(
                f"Video report created successfully at: {final_video_path} (Size: {final_size_mb:.2f}MB)"
            )
            return final_video_path

        except Exception as e:
            # Check if ffmpeg is available
            try:
                subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            except Exception as ffmpeg_error:
                logging.error("FFMPEG is not available. Please install FFMPEG to create video reports.")
                return None

            logging.error(f"Error creating video report at {os.path.dirname(__file__)}: {e}")
            logging.error(f"Debug information:")
            logging.error(f"- Working directory: {os.getcwd()}")
            logging.error(f"- Tests directory: {os.path.dirname(__file__)}")
            logging.error(f"- Screenshots available: {len(self.screenshots_with_actions)}")
            logging.error(f"- Has write permissions: {os.access(os.path.dirname(__file__), os.W_OK)}")
            return None

    async def prompt_agent(self, action_name, screenshot_path):

        prompt = f"""The goal will be to view the screenshot and determine if the action was successful or not.

        The action we were trying to perform was: {action_name}

        This screenshot shows the result of the action.

        In your <answer> block, respond with only one word `True` if the screenshot is as expected, to indicate if the action was successful. If the action was not successful, explain why in the <answer> block, this will be sent to the developers as the error in the test.
        """
        with open(screenshot_path, "rb") as f:
            screenshot = f.read().decode("utf-8")
        screenshot = f"data:image/png;base64,{screenshot}"
        response = self.agixt.prompt_agent(
            agent_name="XT",
            prompt_name="Think About It",
            prompt_args={"user_input": prompt, "file_urls": [screenshot]},
        )
        logging.info(f"Agent response: {response}")
        updated_response = re.sub(r"[^a-zA-Z]", "", response).lower()
        if updated_response != "true":
            raise Exception(
                f"Action failed: {action_name}\nAI suggested the action was not successful:\n{response}"
            )

    async def handle_mfa_screen(self):
        """Handle MFA screenshot"""
        # Decode QR code from screenshot
        await asyncio.sleep(2)
        # await self.take_screenshot(f"Screenshot prior to attempting to decode QR code")
        nparr = np.frombuffer(await self.page.screenshot(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        otp_uri = None
        decoded_objects = decode(img)
        for obj in decoded_objects:
            if obj.type == "QRCODE":
                otp_uri = obj.data.decode("utf-8")
                break
        if not otp_uri:
            raise Exception("Failed to decode QR code")
        logging.info(f"Retrieved OTP URI: {otp_uri}")
        match = re.search(r"secret=([\w\d]+)", otp_uri)
        if match:
            secret_key = match.group(1)
            logging.info(f"Successfully extracted secret key: {secret_key}")
            totp = pyotp.TOTP(secret_key)
            otp_token = totp.now()
            logging.info(f"Generated OTP token: {otp_token}")
            await self.page.fill("#token", otp_token)
            logging.info("Entering OTP token")
            await self.take_screenshot(
                "The user scans the QR code and enrolls it in their authenticator app, then entering the one-time password therefrom."
            )
            logging.info("Submitting OTP token")
            await self.page.click('button[type="submit"]')
        else:
            raise Exception("Failed to extract secret key from OTP URI")
        return secret_key

    async def test_action(
        self, action_description, action_function, followup_function=None
    ):
        """
        Generic method to perform a test action

        Args:
            action_description (str): Description of the action being performed
            action_function (callable): Function to perform the action (async)
        """
        try:
            logging.info(action_description)
            result = await action_function()
            if followup_function:
                await followup_function()
            await self.take_screenshot(f"{action_description}")
            return result
        except Exception as e:
            logging.error(f"Failed {action_description}: {e}")
            raise Exception(f"Failed {action_description}: {e}")

    async def handle_register(self):
        """Handle the registration process"""
        email_address = f"{uuid.uuid4()}@example.com"

        await self.test_action(
            f"The user enters their email address in the registration form. Since this e-mail address doesn't have an account yet, we proceed to the registration page.",
            lambda: self.page.fill("#email", email_address),
        )

        await self.test_action(
            "Clicking the 'Continue with Email' button advances the process.",
            lambda: self.page.locator("text=Continue with Email").click(),
        )

        first_name = "Test"
        last_name = "User"
        await self.test_action(
            f"The user enters their first name, in this case. {first_name}. We are using the name {first_name} {last_name} for demonstration purposes.",
            lambda: self.page.fill("#first_name", first_name),
        )

        await self.test_action(
            f"The user enters their last name: {last_name}.",
            lambda: self.page.fill("#last_name", last_name),
        )

        await self.test_action(
            "Clicking the 'Register' button advances the login process to the multifactor authentication confirmation step after registration, ensuring the user has enrolled therein.",
            lambda: self.page.click('button[type="submit"]'),
        )

        mfa_token = await self.test_action(
            "After successfully entering their one time password, the user is allowed into the application.",
            lambda: self.handle_mfa_screen(),
        )

        logging.info(f"MFA token {mfa_token} handled successfully")
        if "email" in self.features:
            await self.handle_email()
        return email_address, mfa_token

    async def handle_google(self):
        """Handle Google OAuth scenario"""
        # await stealth_async(self.context)

        async def handle_oauth_async(popup):
            self.popup = popup
            logging.info(f"New popup URL: {popup.url}")
            await popup.wait_for_timeout(5000)
            await self.take_screenshot("Google OAuth popup window opened correctly")

            await self.test_action(
                "E-mail is entered in Google OAuth form",
                lambda: popup.fill("#identifierId", os.getenv("GoogleTestEmail")),
            )

            await self.test_action(
                "System advanced to password screen in Google OAuth",
                lambda: popup.click('text="Next"'),
            )

            await self.test_action(
                "Password is entered in Google OAuth form",
                lambda: popup.fill("[type=password]", os.getenv("GoogleTestPassword")),
            )

            await self.test_action(
                "System showing Google safety screen",
                lambda: popup.click('text="Next"'),
            )

            await self.test_action(
                "System showing Google access permissions screen",
                lambda: popup.click('text="Continue"'),
            )

            await self.test_action(
                "system showing scope selection screen",
                lambda: popup.click('text="Continue"'),
            )

            await self.test_action(
                "required scopes are checked for Google OAuth",
                lambda: popup.click("[type=checkbox]"),
            )

            await self.test_action(
                "popup closed", lambda: popup.click('text="Continue"')
            )

            await popup.wait_for_timeout(20000)
            self.popup = None

        self.page.on("popup", handle_oauth_async)

        await self.test_action(
            "Clicking 'Login with Google' button",
            lambda: self.page.locator("text=Login with Google").click(),
        )

        await self.take_screenshot(
            "Google OAuth process completed and returned to main application"
        )


    async def handle_chat(self):
        try:
            await self.test_action(
                "After the user logs in, the chat interface is loaded and ready for their first basic interaction.",
                lambda: self.page.click("text=Chat"),
            )
            await self.test_action(
                "By clicking in the chat bar, the user can expand it to show more options and see their entire input.",
                lambda: self.page.click("#message"),
            )
            await self.test_action(
                "The user enters an input to prompt the default agent, since no advanced settings have been configured, this will use the default A G I X T thought process.",
                lambda: self.page.fill(
                    "#message",
                    "Tell me a short and simple story in one paragraph.",
                ),
            )
            await self.test_action(
                "When the user hits send, or the enter key, the message is sent to the agent and it begins thinking.",
                lambda: self.page.click("#send-message"),
            )
            while not await self.page.locator(
                ":has-text('Conversation renamed')"
            ).count():
                logging.info(f"No rename found yet, waiting 5s.")
                await asyncio.sleep(5)
            logging.info(
                str(
                    await self.page.locator(":has-text('Conversation renamed')").count()
                )
                + "conversation rename detected, continuing."
            )

            await asyncio.sleep(2)

            await self.take_screenshot(
                "When the agent finishes thinking, the agent responds alongside providing its thought process and renaming the conversation contextually."
            )

            await self.test_action(
                "The user can expand the thought process to see the thoughts, reflections and actions.",
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed Activities")
                .click(),
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed Activities")
                .scroll_into_view_if_needed(),
            )
            # Try up to 3 times to get the mermaid visualization
            max_retries = 3
            retry_count = 0
            while retry_count < max_retries:
                try:
                    await self.test_action(
                        "The agent also provides a visualization of its thought process.",
                        lambda: self.page.click(".agixt-activity-diagram"),
                        lambda: self.page.locator(
                            '.flowchart[id^="mermaid"]'
                        ).scroll_into_view_if_needed(),
                    )
                    # If successful, break out of retry loop
                    break
                except Exception as e:
                    retry_count += 1
                    if retry_count < max_retries:
                        logging.info(f"Retrying mermaid visualization (attempt {retry_count+1}/{max_retries})")
                        await asyncio.sleep(2)  # Wait before retrying
                    else:
                        logging.error("Failed to load mermaid visualization after all retries")
                        await self.take_screenshot(
                            "The agent did not provide a visualization of its thought process."
                        )
        except Exception as e:
            logging.error(f"Error nagivating to chat: {e}")
            raise Exception(f"Error nagivating to chat: {e}")

    async def handle_chat_github(self):
        try:
            await self.test_action(
                "After setting up the GitHub extension, the chat interface is loaded to test GitHub integration.",
                lambda: self.page.click("text=Chat"),
            )
            await self.test_action(
                "By clicking in the chat bar, the user can expand it to show more options and see their entire input.",
                lambda: self.page.click("#message"),
            )
            await self.test_action(
                "The user enters an input to test GitHub integration with the agent.",
                lambda: self.page.fill(
                    "#message",
                    "Execute the command get list of my GitHub repositories. What are my repositories?",
                ),
            )
            await self.test_action(
                "When the user hits send, or the enter key, the message is sent to the agent and it begins thinking about the GitHub task.",
                lambda: self.page.click("#send-message"),
            )
            # while not await self.page.locator(
            #     ":has-text('Conversation renamed')"
            # ).count():
            #     logging.info(f"No rename found yet, waiting 5s.")
            #     await asyncio.sleep(5)
            # logging.info(
            #     str(
            #         await self.page.locator(":has-text('Conversation renamed')").count()
            #     )
            #     + "conversation rename detected, continuing."
            # )

            # await asyncio.sleep(2)
            
            
            # Final screenshot after waiting
            await self.take_screenshot(
                "When the agent finishes thinking, it responds with the user's GitHub repositories."
            )

            await self.test_action(
                "The user can expand the completed GitHub activities",
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed Activities")
                .click(),
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed Activities")
                .scroll_into_view_if_needed(),
            )

            # Click the message button first to transform it into an input
            await self.test_action(
                "Click message button to activate input",
                lambda: self.page.click("#message"),
            )

            await asyncio.sleep(1)  # Wait for input to be ready

            # Now fill the input
            await self.test_action(
                "User sends a new message to create a GitHub issue",
                lambda: self.page.keyboard.type(
                    "Create a GitHub issue in the AGiXT-Tests/Repos-test repository titled 'Test Issue' with description 'This is a test issue created by the UI tests'"
                ),
            )

            await self.test_action(
                "Send the GitHub issue creation message",
                lambda: self.page.click("#send-message"),
                lambda: self.page.locator("#message").scroll_into_view_if_needed(),
            )

            await asyncio.sleep(20)  # Wait for response
            
            await self.take_screenshot(
                "GitHub issue creation response is displayed"
            )

            await self.test_action(
                "Check completed activities for issue creation",
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed activities.")
                .first
                .click(),
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed activities.")
                .first
                .scroll_into_view_if_needed(),
            )

            # Get list of GitHub issues
            await self.test_action(
                "Click message button to activate input for issues query",
                lambda: self.page.click("#message"),
            )

            await asyncio.sleep(1)  # Wait for input to be ready

            await self.test_action(
                "User sends a message to get GitHub issues",
                lambda: self.page.keyboard.type(
                    "Get the list of issues from the AGiXT-Tests/Repos-test repository"
                ),
            )

            await self.test_action(
                "Send the get issues message",
                lambda: self.page.click("#send-message"),
                lambda: self.page.locator("#message").scroll_into_view_if_needed(),
            )

            await asyncio.sleep(20)  # Wait for response
            
            await self.take_screenshot(
                "GitHub issues list is displayed"
            )

            # Take another screenshot after scrolling down to show all issues
            await self.test_action(
                "Scroll down to show all GitHub issues",
                lambda: self.page.keyboard.press("End"),
                lambda: self.page.wait_for_timeout(1000)  # Wait for scroll animation
            )
            
            await self.take_screenshot(
                "Full list of GitHub issues after scrolling"
            )

            await self.test_action(
                "Check completed activities for issues list",
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed activities.")
                .first
                .click(),
                lambda: self.page.locator(".agixt-activity")
                .get_by_text("Completed activities.")
                .first
                .scroll_into_view_if_needed(),
            )

            # Take a final screenshot showing GitHub extension usage
            await self.take_screenshot(
                "GitHub extension successfully demonstrated listing repos, creating issues, and viewing issues"
            )

            # # Test 3D modeling with OpenSCAD (commented out for now)
            # await self.test_action(
            #     "Click new chat button for 3D modeling test",
            #     lambda: self.page.click('button:has-text("New Chat")')
            # )
            
            # await asyncio.sleep(1)  # Wait for new chat to load

            # await self.test_action(
            #     "Click message button to activate input for 3D modeling",
            #     lambda: self.page.click("#message"),
            # )

            # await asyncio.sleep(1)  # Wait for input to be ready

            # await self.test_action(
            #     "User sends a message to create a 3D cube",
            #     lambda: self.page.keyboard.type(
            #         "Create a 3D model of a cube with dimensions 20x20x20 using OpenSCAD"
            #     ),
            # )

            # await self.test_action(
            #     "Send the 3D modeling message",
            #     lambda: self.page.click("#send-message"),
            #     lambda: self.page.locator("#message").scroll_into_view_if_needed(),
            # )

            # await asyncio.sleep(20)  # Wait for response
            
            # await self.take_screenshot(
            #     "3D model creation response is displayed"
            # )

            # await self.test_action(
            #     "Check completed activities for 3D model creation",
            #     lambda: self.page.locator(".agixt-activity")
            #     .get_by_text("Completed activities.")
            #     .first
            #     .click(),
            #     lambda: self.page.locator(".agixt-activity")
            #     .get_by_text("Completed activities.")
            #     .first
            #     .scroll_into_view_if_needed(),
            # )

            # await self.test_action(
            #     "Record audio",
            #     lambda: self.page.click("#audio-start-recording"),
            # )
            # with open('./audio.wav', 'rb') as audio_file:
            #     audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
            # await self.page.evaluate(
            #     f"""
            #     // Mock MediaRecorder and getUserMedia for audio file simulation
            #     navigator.mediaDevices.getUserMedia = async () => {{
            #         // Create audio context and media stream
            #         const audioContext = new AudioContext();
            #         const audioBuffer = await audioContext.decodeAudioData(
            #             Uint8Array.from(atob('{audio_base64}'), c => c.charCodeAt(0)).buffer
            #         );

            #         // Create a media stream from the audio buffer
            #         const source = audioContext.createBufferSource();
            #         source.buffer = audioBuffer;
            #         const destination = audioContext.createMediaStreamDestination();
            #         source.connect(destination);

            #         // Start playing the audio
            #         source.start();

            #         return destination.stream;
            #     }};
            # """
            # )

            # await self.test_action(
            #     "Confirm audio",
            #     lambda: self.page.click("#audio-finish-recording"),
            # )

            # await self.test_action(
            #     "message is sent and the timer has started",
            #     lambda: self.page.click("#send-message"),
            # )
            # await asyncio.sleep(120)

            # await self.take_screenshot("voice response")
        except Exception as e:
            logging.error(f"Error nagivating to chat: {e}")
            raise Exception(f"Error nagivating to chat: {e}")

    async def handle_commands_workflow(self):
        """Handle commands workflow scenario"""
        # TODO: Implement commands workflow test
        pass

    async def handle_mandatory_context(self):
        """Test the mandatory context feature by setting and using a context in chat."""
        # Navigate to Agent Management
        await self.test_action(
            "Navigate to Agent Management to begin mandatory context configuration",
            lambda: self.page.click('span:has-text("Agent Management")'),
        )

        await self.take_screenshot("Agent Management drop down")

        # Navigate directly to training URL
        await self.test_action(
            "Navigate to training settings",
            lambda: self.page.goto(f"{self.base_uri}/settings/training?mode=user&")
        )

        # After navigating to Training section, screenshot the interface
        await self.take_screenshot("Training section with mandatory context interface")

        await self.test_action(
            "Locate and enter mandatory context in text area",
            lambda: self.page.fill(
                "textarea[placeholder*='Enter mandatory context']",
                "You are a helpful assistant who loves using the word 'wonderful' in responses.",
            ),
        )

        await self.take_screenshot("Mandatory context has been entered into text area")
        await asyncio.sleep(1)

        await self.test_action(
            "Save mandatory context settings",
            lambda: self.page.click("text=Update Mandatory Context"),
        )

        await self.take_screenshot("Mandatory context update button clicked")

        # Let handle_chat run the conversation
        await self.handle_chat()


    async def handle_email(self):
        """Handle email verification scenario"""
        # TODO: Handle email verification workflow
        pass

    async def handle_login(self, email, mfa_token):
        """Handle login scenario"""
        otp = pyotp.TOTP(mfa_token).now()
        # TODO: Handle login workflow
        pass

    async def handle_logout(self):
        """Handle logout scenario"""
        # TODO: Handle logout workflow
        pass

    async def handle_update_user(self):
        """Handle user update scenario"""
        # TODO: Handle user update workflow
        pass

    async def handle_invite_user(self):
        """Handle user invite scenario"""
        # TODO: Handle user invite workflow
        pass

    async def handle_train_user_agent(self):
        """Handle training user agent scenario"""
        # TODO: Handle training user agent workflow
        pass

    async def handle_train_company_agent(self):
        """Handle training company agent scenario"""
        # TODO: Handle training company agent workflow
        pass





    async def handle_stripe(self):
        """Handle Stripe subscription scenario"""
        await self.take_screenshot("subscription page is loaded with available plans")
        await self.test_action(
            "Stripe checkout page is open",
            lambda: self.page.click(".bg-card button"),
            followup_function=lambda: self.page.wait_for_url(
                "https://checkout.stripe.com/c/**"
            ),
        )

        sus_button = await self.page.query_selector(
            ".Button--link.Button--checkoutSecondaryLink"
        )
        if sus_button:
            await self.test_action(
                "subscription confirmation button is visible", lambda: None
            )
            await self.test_action(
                "Click subscription confirmation button", lambda: sus_button.click()
            )

        await self.test_action(
            "Enter card number",
            lambda: self.page.fill("input#cardNumber", "4242424242424242"),
        )

        await self.test_action(
            "Enter card expiry", lambda: self.page.fill("input#cardExpiry", "1230")
        )

        await self.test_action(
            "Enter card CVC", lambda: self.page.fill("input#cardCvc", "123")
        )

        await self.test_action(
            "Enter billing name",
            lambda: self.page.fill("input#billingName", "Test User"),
        )

        await self.test_action(
            "Select billing country",
            lambda: self.page.select_option("select#billingCountry", "US"),
        )

        await self.test_action(
            "Enter billing postal code",
            lambda: self.page.fill("input#billingPostalCode", "90210"),
        )

        await self.test_action(
            "Submit payment",
            lambda: self.page.click("button.SubmitButton.SubmitButton--complete"),
        )
        await self.page.wait_for_timeout(15000)
        await self.take_screenshot("payment was processed and subscription is active")


    async def handle_provider_settings(self):
        """Test provider settings page navigation and toggle interaction."""
        # Navigate to Agent Management
        await self.test_action(
            "Navigate to Agent Management to begin extensions configuration",
            lambda: self.page.click('span:has-text("Agent Management")'),
        )
        await self.take_screenshot("Agent Management drop down")

        # Navigate to Settings
        await self.test_action(
            "Navigate to Settings",
            lambda: self.page.click('span:has-text("Settings")')
        )

        # Find and click the Connect button for Google
        await self.test_action(
            "Click Connect button for Google provider",
            lambda: self.page.locator('button:has-text("Connect"):right-of(:text("Google"))').first.click()
        )

        # Wait for dialog to appear and input API Key
        await self.test_action(
            "Input Google A-P-I key",
            lambda: self.page.fill('[id="GOOGLE_API_KEY"]', os.getenv('GOOGLE_API_KEY', ''))
        )

        # Click Save/Connect in the dialog
        await self.test_action(
            "Save Google A-P-I key configuration",
            lambda: self.page.get_by_role('button', name='Connect Provider').click()
        )

        # Take screenshot of success state
        await self.take_screenshot("Google provider connected successfully")


    async def handle_abilities_settings_Github(self):
        """Test abilities page navigation and toggle interaction."""

        # Click Abilities tab
        await self.test_action(
            "Navigate to Abilities tab",
            lambda: self.page.click('button[role="tab"][id*="trigger-abilities"]')
        )

        # Take screenshot before toggling
        await self.take_screenshot("abilities_before_toggle")

        # Go to the Get List of My Github Repositories text
        await self.test_action(
            "Scroll down to the My Github Repositories ability", 
            lambda: self.page.get_by_text("Get List of My Github Repositories").click()
        )

        # Find and click the Get List of My Github Repositories toggle switch
        await self.test_action(
            "Toggle the Get List of My Github Repositories ability",
            lambda: self.page.locator('div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Get List of My Github Repositories")').locator('button[role="switch"]').click(),
            lambda: self.page.wait_for_timeout(500)  # Ensure toggle interaction completes
        )

        # Toggle Create Github Repository Issue
        await self.test_action(
            "Toggle Create Github Repository Issue ability",
            lambda: self.page.locator('div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Create Github Repository Issue")').locator('button[role="switch"]').click(),
            lambda: self.page.wait_for_timeout(500)
        )

        # Toggle Get Github Repository Issues
        await self.test_action(
            "Toggle Get Github Repository Issues ability",
            lambda: self.page.locator('div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Get Github Repository Issues")').locator('button[role="switch"]').click(),
            lambda: self.page.wait_for_timeout(500)
        )

        # Take screenshot of GitHub abilities enabled
        await self.take_screenshot("All GitHub abilities successfully enabled")

        # # 3D model ability setup commented out for now
        # await self.take_screenshot("Lets toggle the 3d model ability")
        # await self.handle_abilities_settings_3D_model()


    async def handle_extensions_settings(self):
        """Test extensions page navigation and toggle interaction."""
        try:
            # Navigate to Extensions
            await self.test_action(
                "Navigate to Extensions",
                lambda: self.page.click('span:has-text("Extensions")')
            )

            # Take screenshot before toggling
            await self.take_screenshot("extensions_before_toggle")

            # Find and click the Connect button for GitHub extension
            await self.test_action(
                "Click Connect on GitHub extension",
                lambda: self.page.locator('div.rounded-lg:has-text("Github") button:has-text("Connect")').click()
            )

            # Enter username and API key
            await self.test_action(
                "Enter GitHub user name",
                lambda: self.page.fill('#GITHUB_USERNAME', os.getenv('GITHUB_USERNAME', 'AGiXT-Tests'))
            )

            await self.test_action(
                "Enter GitHub A-P-I key",
                lambda: self.page.fill('#GITHUB_API_KEY', os.getenv('GITHUB_API_KEY', ''))
            )

            # Click Connect Extension button
            await self.test_action(
                "Click Connect Extension button to complete GitHub connection",
                lambda: self.page.click('button:has-text("Connect Extension")')
            )

            # Take screenshot after connection
            await self.take_screenshot("extension connected")

            # Enable GitHub extension commands in Abilities tab
            await self.handle_abilities_settings_Github()

            # Test GitHub integration via chat
            await self.handle_chat_github()

            # Verify we're still on the extensions page
            current_url = self.page.url
            assert "/settings/extensions?mode=user&" in current_url, f"Expected to be on extensions page, but got {current_url}"

        except Exception as e:
            print(f"Error in handle_extensions_settings: {str(e)}")
            raise

    # async def handle_abilities_settings_3D_model(self):
    #     """Test abilities page navigation and toggle interaction."""
        
    #     # Use more specific selector combining class attributes
    #     await self.test_action(
    #         "Scroll down to the 3D model ability",
    #         lambda: self.page.locator(
    #             'div.flex.flex-col.space-y-1\\.5.p-6:has(h3:text("Openscad Modeling"))'
    #         ).click()
    #     )

    #     # Take screenshot before toggling
    #     await self.take_screenshot("abilities_before_toggle")

    #     # Use visible switch within the specific section
    #     await self.test_action(
    #         "Toggle the Create 3D Model ability",
    #         lambda: self.page.locator(
    #             'div.flex.flex-col.space-y-1\\.5.p-6:has(h3:text("Openscad Modeling")) + div button[role="switch"]'
    #         ).click()
    #     )

    #     # Take screenshot after toggle
    #     await self.take_screenshot("abilities_after_toggle")









    async def run(self, headless=True):
        try:
            async with async_playwright() as self.playwright:
                self.browser = await self.playwright.chromium.launch(headless=headless)
                self.context = await self.browser.new_context()
                self.page = await self.browser.new_page()
                self.page.on("console", print_args)
                self.page.set_default_timeout(20000)
                await self.page.set_viewport_size({"width": 1367, "height": 924})

                logging.info(f"Navigating to {self.base_uri}")
                await self.page.goto(self.base_uri)
                await self.take_screenshot(
                    "The landing page of the application is the first thing the user sees."
                )

                logging.info("Clicking 'Register or Login' button")
                await self.page.click('text="Login or Register"')
                await self.take_screenshot(
                    "The user has multiple authentication options if enabled, including several o auth options such as Microsoft or Google. For this test, we will use the basic email authentication."
                )

                if "google" not in self.features:
                    try:
                        email, mfa_token = await self.handle_register()
                    except Exception as e:
                        logging.error(f"Error registering user: {e}")
                        await self.browser.close()
                        raise Exception(f"Error registering user: {e}")
                if "google" in self.features:
                    email = await self.handle_google()
                    mfa_token = ""
                if "google" in self.features:
                    email = await self.handle_google()
                    mfa_token = ""

                # Ensure we wait for the interface to be fully loaded after login
                try:
                    await self.page.wait_for_timeout(5000)  # Wait for initial page load
                    await self.page.wait_for_selector('span:has-text("Agent Management")',
                        state='visible',
                        timeout=30000
                    )
                except Exception as e:
                    logging.error(f"Failed to find Agent Management after login: {e}")
                    await self.take_screenshot("Failed to find Agent Management")
                    raise
                
                # On Linux, go to Agent Management first
                if not is_desktop():

                    await self.handle_provider_settings()

                    # Execute extensions and abilities settings tests
                    await self.handle_extensions_settings()

                    # await self.handle_abilities_settings()


        
                    # Navigate to Agent Management after configuration
                    await self.test_action(
                        "Navigate to Agent Management after login",
                        lambda: self.page.click('span:has-text("Agent Management")'),
                    )
                    await self.take_screenshot("On Agent Management page after login")
                    # Then proceed with mandatory context and other tests
                    # await self.handle_mandatory_context()
                    # await self.handle_chat()
                    chat_handled = True

                    # Run remaining tests
                    if "stripe" in self.features:
                        await self.handle_stripe()
                    await self.handle_train_user_agent()
                    await self.handle_train_company_agent()
                # else:
                #     # Non-Linux flow remains unchanged
                #     if "stripe" in self.features:
                #         await self.handle_stripe()
                #     await self.handle_train_user_agent()
                #     await self.handle_train_company_agent()
                #     await self.handle_mandatory_context()
                #     await self.handle_chat()

                ##
                # Any other tests can be added here
                ##

                await self.handle_logout()
                await self.handle_login(email, mfa_token)
                await self.handle_update_user()
                await self.handle_invite_user()

                video_path = self.create_video_report()
                logging.info(f"Tests complete. Video report created at {video_path}")
                await self.browser.close()
        except Exception as e:
            logging.error(f"Test failed: {e}")
            # Try to create video one last time if it failed during the test
            if not os.path.exists(os.path.join(os.path.dirname(__file__), "report.mp4")):
                self.create_video_report()
            raise e
