type PathMatchResult = Record<string, string>;

/**
 * Defines the path matcher algorithm to check if a route matches with current URL
 * It will also extract the various parameters from the path and return them so that
 * they can be passed on as props to the page component
 * @param currentPath the current path
 * @param route the route to check
 * @returns false if not matched, Record<string, string> if matched, including the path parameters
 */
export default function pathMatch(currentPath: string, route: string): PathMatchResult | false {

  const currentPathPieces = currentPath.split("/");
  const routePieces = route.split("/");
  let params: Record<string, string> = {};

  if (routePieces.length > currentPathPieces.length) {
    return false;
  }

  for (let i = 0; i < currentPathPieces.length; i++) {

    if (i === routePieces.length) {
      break;
    }
    
    const routePiece = routePieces[i];
    const pathPiece = currentPathPieces[i];

    // We have a URI parameter
    if (routePiece.startsWith(":")) {
      params[routePiece.substring(1)] = pathPiece;
    } else if (routePiece !== pathPiece) {
      return false;
    }
  }

  return params;
}