/**
 * Utility to generate namespaces
 * @param namespace_string  Namespace string as 'candlegames.pestis.server.scenes'.
 * @return {Object} Generated namespace, can be new/empty or already existing, 'scenes' = {...} in the example.
 */
function namespace(namespace_string) {
  var namespace_parts = namespace_string.split('.');
  if(namespace_parts.length==0) throw 'You must send a namespace string to this function';
  var parent = window;
  for(var i=0, length=namespace_parts.length; i < length; ++i) {
    var namespace_name = namespace_parts[i];
    if(parent[namespace_name]===undefined) {
      parent[namespace_name] = {};
    }
    parent = parent[namespace_name];
  }
  return parent;
}

var candlegamestools = candlegamestools || {}
candlegamestools.namespace = namespace;
