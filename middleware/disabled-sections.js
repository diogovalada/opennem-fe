export default function disabledSections({ route, redirect }) {
  // Redirect disabled sections to the tracker page.
  const disabledPrefixes = ['/facilities', '/scenarios', '/records', '/analysis']

  const isDisabled = disabledPrefixes.some((prefix) => route.path.startsWith(prefix))
  if (isDisabled) {
    return redirect('/energy')
  }
}
