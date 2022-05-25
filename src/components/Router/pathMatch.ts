type PathMatchResult = Record<string, string>;

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