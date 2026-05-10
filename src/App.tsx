// import { ThemeProvider } from './hooks/useTheme'
import { ThemeProvider } from './components/ThemeToggle/theme-provider'
import { LanguageProvider } from './components/LanguageToggle/language-provider'
import Layout from './Layout/Layout'

function App() {

  return (
    <>
   <div className='overflow-hidden'>
     
       <ThemeProvider>
         <LanguageProvider>
           <Layout></Layout>
         </LanguageProvider>
       </ThemeProvider>
   </div>
    </>
  )
}

export default App
