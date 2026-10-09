import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { CHAT_QUICK_REPLIES } from '../../constants';

export const CommunicationModal: React.FC = () => {
  const {
    isChatModalOpen,
    setIsChatModalOpen,
    activeChatBooking,
    chatMessages,
    sendChatMessage,
    isCallModalOpen,
    endCallModal,
    activeCallBooking,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');

  // Call timer and states
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Call timer effect
  useEffect(() => {
    if (!isCallModalOpen) return;

    const ringTimeout = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    const interval = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearTimeout(ringTimeout);
      clearInterval(interval);
    };
  }, [isCallModalOpen]);

  const handleEndCall = () => {
    setCallStatus('ringing');
    setCallSeconds(0);
    endCallModal();
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;
    sendChatMessage(text);
    setInputMessage('');
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 1. CHAT MODAL */}
      {isChatModalOpen && activeChatBooking && (
        <div className="modal-backdrop" onClick={() => setIsChatModalOpen(false)}>
          <div
            className="modal-surface communication-chat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="chat-modal-header">
              <div className="chat-recipient-info">
                <div className="recipient-avatar-wrap">
                  {activeChatBooking.ustadAvatar ? (
                    <img src={activeChatBooking.ustadAvatar} alt={activeChatBooking.ustadName} />
                  ) : (
                    <div className="avatar-placeholder">U</div>
                  )}
                  <span className="online-indicator" />
                </div>
                <div>
                  <div className="recipient-name-row">
                    <strong>{activeChatBooking.ustadName || 'Ustad'}</strong>
                    <ShieldCheck size={14} className="text-success" />
                  </div>
                  <span className="recipient-sub">
                    Booking #{activeChatBooking.id} • {activeChatBooking.serviceName}
                  </span>
                </div>
              </div>
              <button
                className="close-chat-btn"
                onClick={() => setIsChatModalOpen(false)}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Simulation Notice */}
            <div className="chat-simulation-notice">
              <Info size={13} />
              <span>Simulated In-App Messaging • End-to-end encrypted for customer safety.</span>
            </div>

            {/* Chat Thread */}
            <div className="chat-messages-thread">
              {chatMessages
                .filter((m) => m.bookingId === activeChatBooking.id)
                .map((msg) => {
                  const isMe = msg.senderRole === 'customer';
                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${isMe ? 'my-message' : 'other-message'}`}
                    >
                      <div className="chat-bubble">
                        <span className="sender-tag">{msg.senderName}</span>
                        <p className="message-content">{msg.message}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Quick Replies Carousel */}
            <div className="quick-replies-track">
              {CHAT_QUICK_REPLIES.customer.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-reply-pill"
                  onClick={() => handleSendMessage(reply)}
                >
                  <Sparkles size={12} />
                  <span>{reply}</span>
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form
              className="chat-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="chat-text-field"
                placeholder="Type message to Ustad..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. DIRECT SIMULATED CALL MODAL */}
      {isCallModalOpen && activeCallBooking && (
        <div className="modal-backdrop call-modal-backdrop">
          <div
            className="modal-surface communication-call-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="call-screen-content">
              <div className="call-caller-avatar">
                {activeCallBooking.ustadAvatar ? (
                  <img src={activeCallBooking.ustadAvatar} alt={activeCallBooking.ustadName} />
                ) : (
                  <div className="avatar-placeholder-lg">U</div>
                )}
                <div className="call-pulse-ring" />
              </div>

              <h2 className="caller-name">{activeCallBooking.ustadName}</h2>
              <span className="caller-service-tag">
                {activeCallBooking.categoryId.toUpperCase()} • Booking #{activeCallBooking.id}
              </span>

              <div className="call-status-indicator">
                {callStatus === 'ringing' ? (
                  <span className="status-ringing">Ringing doorstep technician...</span>
                ) : (
                  <span className="status-connected">
                    Connected • {formatCallTime(callSeconds)}
                  </span>
                )}
              </div>

              <div className="call-sim-tag">
                <span>SIMULATED DIRECT VOIP CALL</span>
              </div>

              {/* In-Call Controls */}
              <div className="call-controls-row">
                <button
                  className={`call-ctrl-btn ${isMuted ? 'active' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  <small>{isMuted ? 'Muted' : 'Mute'}</small>
                </button>

                <button
                  className="call-ctrl-btn end-call-btn"
                  onClick={handleEndCall}
                  title="End Call"
                >
                  <PhoneOff size={28} />
                  <small>End Call</small>
                </button>

                <button
                  className={`call-ctrl-btn ${isSpeakerOn ? 'active' : ''}`}
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  title={isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
                >
                  {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
                  <small>Speaker</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
