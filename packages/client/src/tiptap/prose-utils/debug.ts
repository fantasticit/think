export function debug(run) {
  if (typeof window !== 'undefined') {
    if (window.location.search.includes('dev=1')) {
      run();
    }
  }
}
