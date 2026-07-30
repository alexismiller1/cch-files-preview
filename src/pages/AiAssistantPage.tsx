import { ActionButton } from "@react-spectrum/s2";
import UploadIcon from "@react-spectrum/s2/icons/Upload";
import SendIcon from "@react-spectrum/s2/icons/Send";
import InfoCircleIcon from "@react-spectrum/s2/icons/InfoCircle";
import { useSelectedApp } from "../context/SelectedAppContext";
import "./AiAssistantPage.css";

export function AiAssistantPage() {
  const { aiAssistantRequest } = useSelectedApp();

  return (
    <div className="app-frame-content ai-assistant-page">
      <div className="ai-assistant-conversation">
        {aiAssistantRequest && (
          <>
            <div className="ai-assistant-user-message">
              <img src={aiAssistantRequest.thumbnail} alt="" className="ai-assistant-user-thumbnail" />
              <div className="ai-assistant-user-bubble">{aiAssistantRequest.prompt}</div>
            </div>

            <div className="ai-assistant-thinking">
              <span className="ai-assistant-thinking-dots">
                <span />
                <span />
                <span />
              </span>
              Generating response
            </div>
          </>
        )}
      </div>

      <div className="ai-assistant-prompt-bar">
        <div className="ai-assistant-prompt-box">
          <div className="ai-assistant-prompt-input">Ask anything</div>
          <div className="ai-assistant-prompt-actions">
            <ActionButton isQuiet aria-label="Upload"><UploadIcon /></ActionButton>
            <ActionButton isQuiet aria-label="Send"><SendIcon /></ActionButton>
          </div>
        </div>
        <div className="ai-assistant-disclaimer">
          <InfoCircleIcon />
          <span>Verify responses. Adobe Generative AI User Guidelines</span>
        </div>
      </div>
    </div>
  );
}
