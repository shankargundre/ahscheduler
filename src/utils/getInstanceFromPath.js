export function getInstanceFromPath(pathname = window.location.pathname) {
  const match = pathname.match(/\/ahschedular\/([^/]+)/);
  console.log( match[1]);
  return match ? match[1] : 'DEVINST'; // fallback to DEVINST if not found
}
