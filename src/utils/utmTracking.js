/**
 * UTM Tracking Utilities
 * Captura, armazena e repassa parâmetros UTM para o checkout Shopify
 */

// Lista de parâmetros UTM válidos
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

// Outros parâmetros de tracking úteis
const TRACKING_PARAMS = ['fbclid', 'gclid', 'ttclid', 'ref']

// Todos os parâmetros que queremos capturar
const ALL_TRACKING_PARAMS = [...UTM_PARAMS, ...TRACKING_PARAMS]

/**
 * Captura parâmetros UTM da URL atual
 * @returns {Object} Objeto com parâmetros UTM encontrados
 */
export function captureUTMParams() {
  if (typeof window === 'undefined') return {}

  try {
    const urlParams = new URLSearchParams(window.location.search)
    const utmData = {}

    ALL_TRACKING_PARAMS.forEach(param => {
      const value = urlParams.get(param)
      if (value) {
        utmData[param] = value
      }
    })

    return utmData
  } catch (error) {
    console.error('Error capturing UTM params:', error)
    return {}
  }
}

/**
 * Salva parâmetros UTM no sessionStorage
 * @param {Object} utmData - Objeto com parâmetros UTM
 */
export function saveUTMParams(utmData) {
  if (typeof window === 'undefined' || !utmData || Object.keys(utmData).length === 0) {
    return
  }

  try {
    // Pega UTMs existentes
    const existingUTMs = getStoredUTMParams()

    // Merge: novos parâmetros sobrescrevem os antigos
    const mergedUTMs = {
      ...existingUTMs,
      ...utmData,
      _timestamp: Date.now(),
    }

    sessionStorage.setItem('_utm_params', JSON.stringify(mergedUTMs))

    console.log('[UTM Tracking] Params saved:', utmData)
  } catch (error) {
    console.error('Error saving UTM params:', error)
  }
}

/**
 * Recupera parâmetros UTM do sessionStorage
 * @returns {Object} Objeto com parâmetros UTM armazenados
 */
export function getStoredUTMParams() {
  if (typeof window === 'undefined') return {}

  try {
    const stored = sessionStorage.getItem('_utm_params')
    if (!stored) return {}

    const parsed = JSON.parse(stored)

    // Remover _timestamp do retorno
    const { _timestamp, ...utmParams } = parsed

    return utmParams
  } catch (error) {
    console.error('Error getting stored UTM params:', error)
    return {}
  }
}

/**
 * Inicializa tracking de UTMs
 * Captura da URL e salva no sessionStorage
 */
export function initializeUTMTracking() {
  if (typeof window === 'undefined') return

  // Capturar parâmetros da URL atual
  const utmParams = captureUTMParams()

  // Se encontrou parâmetros, salvar
  if (Object.keys(utmParams).length > 0) {
    saveUTMParams(utmParams)
  }
}

/**
 * Adiciona parâmetros UTM a uma URL
 * @param {string} url - URL base
 * @param {Object} utmParams - Parâmetros UTM (opcional, usa os salvos se não fornecido)
 * @returns {string} URL com parâmetros UTM adicionados
 */
export function addUTMsToURL(url, utmParams = null) {
  if (!url) return url

  try {
    const params = utmParams || getStoredUTMParams()

    if (!params || Object.keys(params).length === 0) {
      return url
    }

    // Parse URL
    const urlObj = new URL(url)

    // Adicionar cada parâmetro UTM
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value)
      }
    })

    return urlObj.toString()
  } catch (error) {
    console.error('Error adding UTMs to URL:', error)
    return url
  }
}

/**
 * Formata UTMs para envio ao Meta Pixel / Conversions API
 * @returns {Object} Objeto formatado para custom_data
 */
export function getUTMsForTracking() {
  const utms = getStoredUTMParams()

  if (!utms || Object.keys(utms).length === 0) {
    return {}
  }

  // Retornar no formato que o Facebook espera
  return {
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_term: utms.utm_term,
    utm_content: utms.utm_content,
    // Adicionar outros tracking params como custom fields
    ...(utms.fbclid && { fbclid: utms.fbclid }),
    ...(utms.gclid && { gclid: utms.gclid }),
    ...(utms.ttclid && { ttclid: utms.ttclid }),
    ...(utms.ref && { ref: utms.ref }),
  }
}

/**
 * Limpa parâmetros UTM do sessionStorage
 */
export function clearUTMParams() {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem('_utm_params')
    console.log('[UTM Tracking] Params cleared')
  } catch (error) {
    console.error('Error clearing UTM params:', error)
  }
}
