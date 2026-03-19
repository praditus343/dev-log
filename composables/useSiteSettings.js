// composables/useSiteSettings.js
// Shared composable to fetch and update site_settings table

export const useSiteSettings = () => {
  const supabase = useSupabaseClient()

  const getSettings = async (keys) => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', keys)

    if (error) throw error

    // Convert array to a key-value object for ease of use
    return data.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})
  }

  const saveSetting = async (key, value) => {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (error) throw error
  }

  const saveSettings = async (settingsObject) => {
    const rows = Object.entries(settingsObject).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' })

    if (error) throw error
  }

  return { getSettings, saveSetting, saveSettings }
}
