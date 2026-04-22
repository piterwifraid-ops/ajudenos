const CPF_API_TOKEN =
  'bef7dbfe0994308f734fbfb4e2a0dec17aa7baed9f53a0f5dd700cf501f39f26'
const CPF_API_BASE = 'https://magmadatahub.com/api.php'

function deepGet(obj, ...paths) {
  for (const p of paths) {
    const parts = p.split('.')
    let cur = obj
    for (const k of parts) cur = cur?.[k]
    if (cur !== undefined && cur !== null && cur !== '') return cur
  }
  return null
}

function extract(data) {
  // Tenta múltiplos formatos de resposta
  let root =
    data?.dados?.[0] ||
    data?.data?.[0] ||
    data?.data ||
    data?.result ||
    data?.response ||
    data
  if (Array.isArray(root)) root = root[0] || {}

  const name =
    deepGet(root, 'nome', 'name', 'nome_completo', 'fullName', 'NOME') || null
  const birth =
    deepGet(
      root,
      'data_nascimento',
      'nascimento',
      'nasc',
      'dtNascimento',
      'DT_NASCIMENTO',
      'birth',
      'birthDate'
    ) || null
  const gender =
    deepGet(root, 'sexo', 'gender', 'SEXO') || null
  const mother =
    deepGet(
      root,
      'nome_mae',
      'mae',
      'NOME_MAE',
      'motherName',
      'nomeMae',
      'nome_da_mae'
    ) || null
  const phone =
    deepGet(root, 'telefone', 'celular', 'phone', 'TELEFONE') || null
  const email = deepGet(root, 'email', 'EMAIL') || null

  return { name, birth, gender, mother, phone, email, raw: data }
}

/**
 * Consulta o CPF na API magmadatahub e opcionalmente persiste no localStorage.
 * Retorna { name, birth, gender, mother, phone, email, raw } ou null em caso de erro.
 */
export async function lookupCpf(cpf, { persist = true } = {}) {
  const clean = String(cpf || '').replace(/\D/g, '')
  if (clean.length !== 11) return null
  try {
    const res = await fetch(`${CPF_API_BASE}?token=${CPF_API_TOKEN}&cpf=${clean}`)
    if (!res.ok) return null
    const data = await res.json()
    const info = extract(data)
    if (persist) {
      if (info.name) localStorage.setItem('user_name', info.name)
      if (info.birth) localStorage.setItem('user_birth', info.birth)
      if (info.gender) localStorage.setItem('user_gender', info.gender)
      if (info.mother) localStorage.setItem('user_mother', info.mother)
      if (info.phone) localStorage.setItem('user_phone_api', info.phone)
      if (info.email) localStorage.setItem('user_email_api', info.email)
      localStorage.setItem('user_cpf_lookup', JSON.stringify(info.raw))
    }
    return info
  } catch (e) {
    console.error('CPF lookup error:', e)
    return null
  }
}
