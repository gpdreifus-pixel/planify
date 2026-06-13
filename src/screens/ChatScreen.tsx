import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import ProgressBar from '../components/ui/ProgressBar'
import ChatBubble from '../components/chat/ChatBubble'
import ChatAnswerChips from '../components/chat/ChatAnswerChips'
import ChatInputBar from '../components/chat/ChatInputBar'
import { useChatStore } from '../store/chatStore'
import { useSearchStore } from '../store/searchStore'
import { CHAT_STEPS } from '../data/mockData'
import { pageVariants, pageTransition } from '../animations/transitions'

export default function ChatScreen() {
  const { step: stepParam } = useParams<{ step: string }>()
  const navigate = useNavigate()
  const { setStep, userInput, setUserInput, setCriteria } = useChatStore()
  const { search } = useSearchStore()
  const [selectedChips, setSelectedChips] = useState<string[]>([])

  const stepNum = parseInt(stepParam ?? '1', 10)
  const totalSteps = CHAT_STEPS.length

  useEffect(() => {
    if (stepNum >= 1 && stepNum <= totalSteps) {
      setStep(stepNum)
    }
  }, [stepNum, setStep, totalSteps])

  // Guard: entrar por URL directa a /chat/7 sin haber respondido nada deja
  // al usuario a mitad de un flujo sin contexto — lo mandamos al paso 1.
  // (criteria persiste en localStorage, así que recargar mitad de flujo es válido)
  useEffect(() => {
    const criteria = useChatStore.getState().criteria
    const hasAnswers = Object.values(criteria).some((v) => v !== undefined && v !== '')
    if (stepNum > 1 && !hasAnswers) {
      navigate('/chat/1', { replace: true })
    }
    // Solo al montar — durante el flujo normal siempre hay respuestas previas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset de chips al cambiar de paso — patrón "adjust state during render"
  // (evita el setState dentro del effect, que dispara renders en cascada)
  const [chipsStep, setChipsStep] = useState(stepNum)
  if (chipsStep !== stepNum) {
    setChipsStep(stepNum)
    setSelectedChips([])
  }

  const stepData = CHAT_STEPS[stepNum - 1]
  const progress = (stepNum / totalSteps) * 100

  const advance = async (value?: string | string[]) => {
    const answer = value ?? userInput
    if (Array.isArray(answer)) {
      if (answer.length === 0) return
    } else {
      if (!answer.trim() && !value) return
    }

    // Save to criteria
    if (stepData?.field) {
      setCriteria({ [stepData.field]: answer })
    }
    setUserInput('')

    if (stepNum < totalSteps) {
      navigate(`/chat/${stepNum + 1}`)
    } else {
      // Last step → search with accumulated criteria + go to summary
      const currentCriteria = useChatStore.getState().criteria
      await search(currentCriteria)
      navigate('/chat/summary')
    }
  }

  const handleChipSelect = (chip: string) => {
    if (stepData?.isMulti) {
      if (chip.includes('Nada más') || chip.includes('Ninguno')) {
        setSelectedChips([chip])
      } else {
        setSelectedChips((prev) => {
          const withoutNone = prev.filter(c => !c.includes('Nada más') && !c.includes('Ninguno'))
          if (withoutNone.includes(chip)) {
            return withoutNone.filter((c) => c !== chip)
          }
          return [...withoutNone, chip]
        })
      }
    } else {
      advance(chip)
    }
  }

  const advanceMulti = () => {
    if (selectedChips.length > 0) {
      advance(selectedChips)
    }
  }

  // Reduce la fricción del flujo de 10 pasos: toda pregunta posterior al
  // destino se puede saltear sin registrar respuesta.
  const skipStep = async () => {
    setUserInput('')
    if (stepNum < totalSteps) {
      navigate(`/chat/${stepNum + 1}`)
    } else {
      const currentCriteria = useChatStore.getState().criteria
      await search(currentCriteria)
      navigate('/chat/summary')
    }
  }

  const goBack = () => {
    if (stepNum > 1) navigate(`/chat/${stepNum - 1}`)
    else navigate('/')
  }

  const handleRestart = () => {
    useChatStore.getState().reset()
    navigate('/chat/1', { replace: true })
  }

  if (!stepData) return null

  return (
    <AppBackground variant="chat">
      <TopAppBar
        onBack={goBack}
        rightSlot={
          <div className="flex items-center gap-3">
            <span className="t-label font-normal text-white/80" aria-label={`Paso ${stepNum} de ${totalSteps}`}>
              {stepNum}/{totalSteps}
            </span>
            <button 
              onClick={handleRestart}
              className="neu-icon-btn w-9 h-9 flex items-center justify-center text-white opacity-80 hover:opacity-100"
              aria-label="Reiniciar búsqueda"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            </button>
          </div>
        }
      />

      <ProgressBar value={progress} />

      <AnimatePresence mode="wait">
        <motion.main
          key={stepNum}
          className="flex-1 flex flex-col pb-[120px] max-w-md mx-auto w-full relative z-10 px-6"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          <ChatBubble question={stepData.question} hint={stepData.hint} />

          {stepData.chips && stepData.chips.length > 0 && (
            <div className="flex flex-col">
              <ChatAnswerChips
                chips={stepData.chips}
                onSelect={handleChipSelect}
                isMulti={stepData.isMulti}
                selectedValues={selectedChips}
              />
              {stepData.isMulti && selectedChips.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={advanceMulti}
                  className="t-cta mt-6 ml-[52px] w-fit px-8 py-3 rounded-full neu-btn-primary text-white flex items-center gap-2"
                >
                  Continuar
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </motion.button>
              )}
            </div>
          )}

          {/* Omitir — el destino (paso 1) es la única pregunta esencial */}
          {stepNum > 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              onClick={skipStep}
              className="t-label font-normal mt-5 ml-[52px] w-fit py-2 text-white/60 hover:text-white/85 transition-colors underline decoration-white/25 underline-offset-4"
            >
              Omitir esta pregunta
            </motion.button>
          )}
        </motion.main>
      </AnimatePresence>

      {!stepData.isMulti && (
        <ChatInputBar
          value={userInput}
          onChange={setUserInput}
          onSend={() => advance()}
          placeholder={stepData.placeholder}
        />
      )}
    </AppBackground>
  )
}
