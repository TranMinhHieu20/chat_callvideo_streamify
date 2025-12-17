import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('StreamifyTheme') || 'forest',
  setTheme: (theme) => {
    localStorage.setItem('StreamifyTheme', theme)
    set({ theme: theme })
  }
}))
