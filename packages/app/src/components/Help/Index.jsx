import { useState } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

const HelpIcon = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{ cursor: 'help', position: 'relative', marginLeft: '3px' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <BiHelpCircle size={20} color="#00adee" />
      </div>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 'calc(100% + 10px)',
            transform: 'translateY(-50%)',
            backgroundColor: '#00adee',
            color: '#fff',
            padding: '4px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 999,
            width: 'auto',
          }}
        >
          <div style={{ width: '100%', whiteSpace: 'nowrap' }}>{text}</div>
        </div>
      )}
    </div>
  )
}

export default HelpIcon
