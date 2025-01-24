from FrontEnd import FrontEndTest
import asyncio
import logging
import sys
import os
import platform
import nest_asyncio


class TestRunner:
    def __init__(self):
        pass

    def run(self):
        test = FrontEndTest(base_uri="http://localhost:3437")
        try:
            if platform.system() == "Linux":
                print("Linux Detected, using asyncio.run")
                if not asyncio.get_event_loop().is_running():
                    try:
                        asyncio.run(test.run())
                    except Exception as e:
                        logging.error(f"Test execution failed: {e}")
                        # Make one final attempt to create video if it doesn't exist
                        video_report_path = test.create_video_report()
                        if video_report_path:
                            print(f"Fallback video report screenshot created at: {video_report_path}")
                        sys.exit(1)
                else:
                    try:

                        nest_asyncio.apply()
                        asyncio.get_event_loop().run_until_complete(test.run())
                    except Exception as e:
                        logging.error(f"Test execution failed: {e}")
                        video_report_path = test.create_video_report()
                        if video_report_path:
                            print(f"Fallback video report screenshot created at: {video_report_path}")
                        sys.exit(1)
            else:
                print("Windows Detected, using asyncio.ProactorEventLoop")
                loop = asyncio.ProactorEventLoop()
                nest_asyncio.apply(loop)
                try:
                    loop.run_until_complete(test.run(False))
                except Exception as e:
                    logging.error(f"Test execution failed: {e}")
                    if not os.path.exists(os.path.join(os.getcwd(), "report.mp4")):
                        test.create_video_report()
                    sys.exit(1)
                finally:
                    loop.close()
        except Exception as e:
            logging.error(f"Critical failure: {e}")
            # Try one last time to create video even in case of critical failure
            video_report_path = test.create_video_report()
            if video_report_path:
                print(f"Fallback video report screenshot created at: {video_report_path}")
            sys.exit(1)
