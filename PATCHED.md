# @kobalte/core 2.0.0-alpha.5, patched

The published `@kobalte/core@2.0.0-alpha.5` npm package with one fix applied to
its built `dist/dismissable-layer/*` files: kobaltedev/kobalte#780 (fixes
kobaltedev/kobalte#755). A `DismissableLayer` registers itself once its element
exists, so a `Dialog.Content` inside `Dialog.Portal` closes on Escape and on an
outside press.

The source change lives on the `solid2-dismissable-layer-fix` branch. Drop this
branch once upstream releases the fix.
