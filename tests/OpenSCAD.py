import asyncio


class TestOpenSCAD:

    def __init__(self, page, action_callback):
        self.page = page
        self.action_callback = action_callback

    async def setup(self):
        # Navigate to Abilities
        await self.action_callback(
            "Navigate to Abilities",
            lambda: self.page.click('span:has-text("Abilities")'),
        )
        # Take screenshot before toggling
        await self.action_callback(
            "Abilities before toggling the ability",
            lambda: asyncio.sleep(1),
        )

        # Find and click the Connect button for GitHub extension
        await self.action_callback(
            "Click to enable the open s-cad ability",
            lambda: self.page.locator(
                'div.rounded-lg:has-text("Openscad Modeling") button'
            ).click(),
        )

    async def run(self):

        # Test 3D modeling with OpenSCAD (commented out for now)
        await self.action_callback(
            "Click new chat button for 3D modeling test",
            lambda: self.page.click('button:has-text("New Chat")'),
        )

        await asyncio.sleep(1)  # Wait for new chat to load

        await self.action_callback(
            "Click message button to activate input for 3D modeling",
            lambda: self.page.click("#message"),
        )

        await asyncio.sleep(1)  # Wait for input to be ready

        await self.action_callback(
            "User sends a message to create a 3D cube",
            lambda: self.page.keyboard.type(
                "Create a 3D model of a cube with dimensions 20x20x20 using OpenSCAD"
            ),
        )

        await self.action_callback(
            "Send the 3D modeling message",
            lambda: self.page.click("#send-message"),
            lambda: self.page.locator("#message").scroll_into_view_if_needed(),
        )
        await self.action_callback(
            "3D model creation response is displayed", lambda: asyncio.sleep(300)
        )

        await self.action_callback(
            "Check completed activities for 3D model creation",
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.click(),
            lambda: self.page.locator(".agixt-activity")
            .get_by_text("Completed activities.")
            .first.scroll_into_view_if_needed(),
        )
