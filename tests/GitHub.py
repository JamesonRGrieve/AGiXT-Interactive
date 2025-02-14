import asyncio
import os


class TestGitHub:
    def __init__(self, page, action_callback):
        self.page = page
        self.action_callback = action_callback

    async def setup(self):
        # Navigate to Extensions
        await self.action_callback(
            "Navigate to Extensions",
            lambda: self.page.click('span:has-text("Extensions")'),
        )

        # Take screenshot before toggling
        await self.action_callback(
            "extensions_before_toggle",
            lambda: asyncio.sleep(1),
        )

        # Find and click the Connect button for GitHub extension
        await self.action_callback(
            "Click Connect on GitHub extension",
            lambda: self.page.locator(
                'div.rounded-lg:has-text("Github") button:has-text("Connect")'
            ).click(),
        )

        # Enter username and API key
        await self.action_callback(
            "Enter GitHub user name",
            lambda: self.page.fill(
                "#GITHUB_USERNAME", os.getenv("GITHUB_USERNAME", "AGiXT-Tests")
            ),
        )

        await self.action_callback(
            "Enter GitHub A-P-I key",
            lambda: self.page.fill("#GITHUB_API_KEY", os.getenv("GITHUB_API_KEY", "")),
        )

        # Click Connect Extension button
        await self.action_callback(
            "Click Connect Extension button to complete GitHub connection",
            lambda: self.page.click('button:has-text("Connect Extension")'),
        )
        # Click Abilities tab
        await self.action_callback(
            "Navigate to Abilities tab",
            lambda: self.page.click('button[role="tab"][id*="trigger-abilities"]'),
        )

        await self.action_callback(
            "abilities_before_toggle",
            lambda: asyncio.sleep(1),
        )

        # Go to the Get List of My Github Repositories text
        await self.action_callback(
            "Scroll down to the My Github Repositories ability",
            lambda: self.page.get_by_text("Get List of My Github Repositories").click(),
        )

        # Find and click the Get List of My Github Repositories toggle switch
        await self.action_callback(
            "Toggle the Get List of My Github Repositories ability",
            lambda: self.page.locator(
                'div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Get List of My Github Repositories")'
            )
            .locator('button[role="switch"]')
            .click(),
            lambda: self.page.wait_for_timeout(
                500
            ),  # Ensure toggle interaction completes
        )

        # Toggle Create Github Repository Issue
        await self.action_callback(
            "Toggle Create Github Repository Issue ability",
            lambda: self.page.locator(
                'div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Create Github Repository Issue")'
            )
            .locator('button[role="switch"]')
            .click(),
            lambda: self.page.wait_for_timeout(500),
        )

        # Toggle Get Github Repository Issues
        await self.action_callback(
            "Toggle Get Github Repository Issues ability",
            lambda: self.page.locator(
                'div.rounded-lg.bg-card.text-card-foreground.shadow-sm.p-4.border.border-border\\/50:has-text("Get Github Repository Issues")'
            )
            .locator('button[role="switch"]')
            .click(),
            lambda: self.page.wait_for_timeout(500),
        )

        # Take screenshot of GitHub abilities enabled
        await self.take_screenshot("All GitHub abilities successfully enabled")

    async def run(self):
        await self.action_callback(
            "After setting up the GitHub extension, the chat interface is loaded to test GitHub integration.",
            lambda: self.page.click("text=Chat"),
        )
        await self.action_callback(
            "By clicking in the chat bar, the user can expand it to show more options and see their entire input.",
            lambda: self.page.click("#message"),
        )
        await self.action_callback(
            "The user enters an input to test GitHub integration with the agent.",
            lambda: self.page.fill(
                "#message",
                "Execute the command get list of my GitHub repositories. What are my repositories?",
            ),
        )
        await self.action_callback(
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

        await self.action_callback(
            "When the agent finishes thinking, it responds with the user's GitHub repositories.",
            lambda: asyncio.sleep(2),
        )

        await self.action_callback(
            "The user can expand the completed GitHub activities",
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed Activities")
            .click(),
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed Activities")
            .scroll_into_view_if_needed(),
        )

        # Click the message button first to transform it into an input
        await self.action_callback(
            "Click message button to activate input",
            lambda: self.page.click("#message"),
        )

        await asyncio.sleep(1)  # Wait for input to be ready

        # Now fill the input
        await self.action_callback(
            "User sends a new message to create a GitHub issue",
            lambda: self.page.keyboard.type(
                "Create a GitHub issue in the AGiXT-Tests/Repos-test repository titled 'Test Issue' with description 'This is a test issue created by the UI tests'"
            ),
        )

        await self.action_callback(
            "Send the GitHub issue creation message",
            lambda: self.page.click("#send-message"),
            lambda: self.page.locator("#message").scroll_into_view_if_needed(),
        )

        await self.action_callback(
            "GitHub issue creation response is displayed",
            lambda: asyncio.sleep(20),
        )

        await self.action_callback(
            "Check completed activities for issue creation",
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.click(),
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.scroll_into_view_if_needed(),
        )

        # Get list of GitHub issues
        await self.action_callback(
            "Click message button to activate input for issues query",
            lambda: self.page.click("#message"),
        )

        await asyncio.sleep(1)  # Wait for input to be ready

        await self.action_callback(
            "User sends a message to get GitHub issues",
            lambda: self.page.keyboard.type(
                "Get the list of issues from the AGiXT-Tests/Repos-test repository"
            ),
        )

        await self.action_callback(
            "Send the get issues message",
            lambda: self.page.click("#send-message"),
            lambda: self.page.locator("#message").scroll_into_view_if_needed(),
        )
        await self.action_callback(
            "GitHub issues list is displayed",
            lambda: asyncio.sleep(20),
        )

        # Take another screenshot after scrolling down to show all issues
        await self.action_callback(
            "Scroll down to show all GitHub issues",
            lambda: self.page.keyboard.press("End"),
            lambda: self.page.wait_for_timeout(1000),  # Wait for scroll animation
        )
        await self.action_callback(
            "Full list of GitHub issues after scrolling",
            lambda: asyncio.sleep(1),
        )

        await self.action_callback(
            "Check completed activities for issues list",
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.click(),
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.scroll_into_view_if_needed(),
        )
        await self.action_callback(
            "GitHub extension successfully demonstrated listing repos, creating issues, and viewing issues",
            lambda: asyncio.sleep(1),
        )
