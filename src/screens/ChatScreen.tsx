import { useEffect } from 'react'
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

  const stepNum = parseInt(stepParam ?? '1', 10)
  const totalSteps = CHAT_STEPS.length

  useEffect(() => {
    if (stepNum >= 1 && stepNum <= totalSteps) {
      setStep(stepNum)
    }
  }, [stepNum, setStep, totalSteps])

  const stepData = CHAT_STEPS[stepNum - 1]
  const progress = (stepNum / totalSteps) * 100

  const advance = async (value?: string) => {
    const answer = value ?? userInput
    if (!answer.trim() && !value) return

    // Save to criteria
    if (stepData?.field) {
      setCriteria({ [stepData.field]: answer })
    }
    setUserInput('')

    if (stepNum < totalSteps) {
      navigate(`/chat/${stepNum + 1}`)
    } else {
      // Last step → search with accumulated criteria + go to summary
      const { criteria } = useChatStore.getState()
      await search(criteria)
      navigate('/chat/summary')
    }
  }

  const goBack = () => {
    if (stepNum > 1) navigate(`/chat/${stepNum - 1}`)
    else navigate('/')
  }

  if (!stepData) return null

  return (
    <AppBackground variant="chat">
      <TopAppBar
        onBack={goBack}
        rightSlot={
          <span
            className="text-white/80"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}
          >
            {stepNum}/{totalSteps}
          </span>
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
            <ChatAnswerChips
              chips={stepData.chips}
              onSelect={(chip) => advance(chip)}
            />
          )}
        </motion.main>
      </AnimatePresence>

      <ChatInputBar
        value={userInput}
        onChange={setUserInput}
        onSend={() => advance()}
        placeholder={stepData.placeholder}
      />
    </AppBackground>
  )
}
