import { SettingsProvider, useSettings } from './settings'
import { PlayerProvider } from '../audio/player'
import { LessonNavProvider } from './navigation'
import { DesktopGate } from './DesktopGate'
import { Header } from './Header'
import { Hero, Legend, Sources, Footer } from './chrome'
import { LessonSection } from '../components/LessonSection'
import { LESSONS } from '../lessons/registry'
import { LESSON_COMPONENTS } from '../lessons'
import './app.css'

function Shell() {
  return (
    <LessonNavProvider>
      <DesktopGate>
        <Header />
        <main>
          <Hero />
          <Legend />
          {LESSONS.map((meta) => {
            const Content = LESSON_COMPONENTS[meta.id]
            return (
              <LessonSection key={meta.id} meta={meta}>
                <Content />
              </LessonSection>
            )
          })}
          <Sources />
        </main>
        <Footer />
      </DesktopGate>
    </LessonNavProvider>
  )
}

function WithAudio() {
  const { prefs } = useSettings()
  return (
    <PlayerProvider volume={prefs.volume}>
      <Shell />
    </PlayerProvider>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <WithAudio />
    </SettingsProvider>
  )
}
