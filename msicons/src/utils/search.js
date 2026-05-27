/**
 * Common abbreviations and aliases for Microsoft Azure services.
 * Keys are the short terms users type; values are expanded search strings.
 */
const ALIASES = {
  vm:          'virtual machine',
  vms:         'virtual machines',
  vmss:        'virtual machine scale set',
  k8s:         'kubernetes',
  aks:         'kubernetes service',
  acr:         'container registry',
  aci:         'container instances',
  vnet:        'virtual network',
  nsg:         'network security',
  agw:         'application gateway',
  fw:          'firewall',
  lb:          'load balancer',
  cdn:         'content delivery',
  sa:          'storage account',
  blob:        'blob storage',
  cosmos:      'cosmos db',
  pg:          'postgresql',
  aad:         'active directory',
  entra:       'entra id',
  rbac:        'role',
  ml:          'machine learning',
  apim:        'api management',
  swa:         'static web',
  sb:          'service bus',
  kv:          'key vault',
  waf:         'web application firewall',
  ado:         'azure devops',
  fn:          'functions',
  func:        'functions',
  app:         'app service',
  sql:         'sql server',
  adf:         'data factory',
  logic:       'logic app',
  la:          'log analytics',
  monitor:     'azure monitor',
  defender:    'microsoft defender',
  sentinel:    'microsoft sentinel',
  openai:      'azure openai',
  cognitive:   'cognitive services',
  iot:         'iot hub',
  dps:         'device provisioning',
  arc:         'azure arc',
  policy:      'azure policy',
  mgmt:        'management',
  bp:          'blueprints',
  rg:          'resource group',
  sub:         'subscriptions',
}

/**
 * Filters the icon list by query text and category.
 * Supports keyword aliases, multi-word queries (all tokens must match),
 * and searches both icon name and category.
 *
 * @param {Array}  allIcons  - Full icons array from icons.json
 * @param {string} query     - User search input
 * @param {string} category  - Category filter value ('all' or category string)
 * @returns {Array} Filtered icons
 */
export function searchIcons(allIcons, query, category) {
  let result = allIcons

  if (category !== 'all') {
    result = result.filter(i => i.category === category)
  }

  const q = query.trim().toLowerCase()
  if (!q) return result

  // Expand alias if the whole query matches a known short form
  const expanded = ALIASES[q] ?? q
  const tokens = expanded.split(/\s+/).filter(Boolean)

  return result.filter(icon => {
    const haystack = `${icon.name.toLowerCase()} ${icon.category.toLowerCase()}`
    return tokens.every(t => haystack.includes(t))
  })
}
