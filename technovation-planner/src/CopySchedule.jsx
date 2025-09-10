import React, { useState } from 'react'
import './CopySchedule.css'

const CopySchedule = ( { generateSchedule }) => {
    const [copyStatus, setCopyStatus] = useState(false)
    const buttonClass = copyStatus ? 'copiedButton' : 'copyButton'

    const handleCopy = async () => {
        const schedule = generateSchedule()
        try {
            await navigator.clipboard.writeText(schedule)
            setCopyStatus(true)
        } catch (err) {
            console.error('Failed to copy schedule: ', err)
        } finally {
            setTimeout(() => setCopyStatus(false), 2000)
        }
    }

    return (
        <div>
            <button className={ buttonClass } onClick={ handleCopy }>
                { copyStatus ? 'Copied!' : 'Copy Schedule'}
            </button>
        </div>
    )
}

export default CopySchedule

