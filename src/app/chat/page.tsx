import { ChatAssistant } from "@/components/ChatAssistant";

export const metadata = {
  title: "Chat Assistant | AgriAssist SMS",
};

export default function ChatPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <ChatAssistant />
    </div>
  );
}
