class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = null;
    this.isImportant = false;
    this.isDynamic = false;
    this.pattern = '';
    this.path = "";
    this.method = "";
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(path, route) {
    let node = this.root;
    const pathSegments = path.split('/').filter(Boolean); // Split path by segments
  
    // If it's the root path '/', treat it separately
    if (path === '/') {
      node.isEndOfWord = true;
      node.handler = route.handler;
      node.isImportant = route.isImportant;
      node.path = path;
      node.method =  route.method
      return;
    }
  
    for (const segment of pathSegments) {
      let isDynamic = false;
      let key = segment;
  
      if (segment.startsWith(':')) {
        isDynamic = true;
        key = ':';  // Store dynamic routes under the key ':'
      }
  
      if (!node.children[key]) {
        node.children[key] = new TrieNode();
      }
  
      node = node.children[key];
  
      // Set dynamic route information if applicable
      node.isDynamic = isDynamic;
      node.pattern = segment;  // Store the actual pattern like ':id'
    }
  
    // After looping through the entire path, assign route details
    node.isEndOfWord = true;
    node.method = route.method;
    node.handler = route.handler;
    node.isImportant = route.isImportant;
    node.path = path;  // Store the original path
  }
  
  

  search(path) {
    let node = this.root;
    const pathSegments = path.split('/').filter(Boolean);  // Split incoming path into segments
    // let importantHandler = null;
  
    for (const segment of pathSegments) {
      let key = segment;
  
      if (!node.children[key]) {
        if (node.children[':']) {
          // If there's no exact match, try matching dynamic segments (e.g., ':id')
          node = node.children[':'];
        } else {
          return null;  // No match found
        }
      } else {
        node = node.children[key];
      }
  
      // if (node.isEndOfWord && node.isImportant) {
      //   importantHandler = node.handler;
      // }
    }
  
    return node.isEndOfWord ? {
      path: node.path,
      handler: node.handler,
      // isImportant: node.isImportant,
      isDynamic: node.isDynamic,
      pattern: node.pattern,
      method:node.method
    } : null;
  }
  

    // New getAllRoutes method

  getAllRoutes() {
    const routes = [];
    // Helper function to recursively collect all routes
    const traverse = (node, currentPath) => {
      if (node.isEndOfWord) {
        routes.push({
          path: currentPath,
          handler: node.handler,
          isImportant: node.isImportant,
          isDynamic: node.isDynamic,
          pattern: node.pattern,
        });
      }
      // Recursively traverse all children
      for (const key in node.children) {
        const child = node.children[key];
        const newPath = currentPath + (key === ':' ? '/:' + child.pattern : '/' + key); // Reconstruct the full path
        traverse(child, newPath);
      }
    };
    // Start traversal from the root
    traverse(this.root, "");
    return routes;
  }
}

module.exports = Trie