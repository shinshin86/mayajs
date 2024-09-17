const Maya = require("./server.js");

class Router extends Maya{
    constructor() {
      super()
    }
    #defineRoute(method, path) {
        // let isImportant = false;
        const chain = {
          // isImportant: () => {
          //   isImportant = true;
          //   return chain;
          // },
          handler: (handler) => {
            this.trie.insert(path, { handler, method })
          }
        };
        return chain;
      }

      get(path) {
        return this.#defineRoute("GET", path);
      }
    
      post(path) {
        return this.#defineRoute("POST", path);
      }
    
      put(path) {
        return this.#defineRoute("PUT", path);
      }
    
      delete(path) {
        return this.#defineRoute("DELETE", path);
      }
    
      patch(path) {
        return this.#defineRoute("PATCH", path);
      }
}

module.exports = Router