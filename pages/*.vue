<script>
// 404 catch-all route
// In SPA mode (ssr: false), Nuxt's trailingSlash config only affects link generation,
// not automatic redirects. This route handles both trailing slash redirects and 404s.
export default {
  asyncData({ route, redirect }) {
    // Redirect missing trailing slashes to their canonical slash version
    if (!route.path.endsWith('/')) {
      return redirect({
        path: `${route.path}/`,
        query: route.query,
        hash: route.hash
      })
    }

    // Unknown routes with trailing slashes fall back to the homepage
    return redirect('/')
  }
}
</script>