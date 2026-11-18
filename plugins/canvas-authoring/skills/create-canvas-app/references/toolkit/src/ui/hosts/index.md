# Host presentation

Keep workflows, state and accessible interaction independent of the host's
appearance. Select a visual profile explicitly where the host opens the canvas;
light/dark attributes describe appearance, not host identity.

| Profile | Design | Theme delivery | Status |
| --- | --- | --- | --- |
| `github-app` | [Primer-based design](github-app/design.md) | [Host-owned appearance](github-app/theming.md) | Opt-in structural profile for Button, MessageBar and product-owned layout |
| Standalone | Shared toolkit defaults | Browser light/dark fallback | No host integration implied |

Other hosts need their own verified integration and profile. Adding an ID or
copying another host's tokens does not establish support.

These public guides and the profile stylesheet ship with the toolkit. The
`prepareCanvasUiAssets` helper copies them into standalone canvas payloads;
mount the returned asset map to serve them without a repository checkout.
The visual-profile registry exposes the stylesheet and guide routes.

Start with the package's `ui-components.md` for component integration.
Profiles change presentation, not action permissions, state
ownership, navigation or keyboard behavior.
