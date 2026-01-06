import { useState, useEffect } from "react";
import { LuClock8 } from "react-icons/lu";
import { GoPaperclip } from "react-icons/go";
import SendIcon from "@/components/icons/sendIcon";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import {
  getComplaintMessages,
  sendMessageToComplaint,
} from "@/services/adminService";

const Chat = ({ complaint }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // جلب رسائل الشكوى عند فتح الدردشة
  useEffect(() => {
    if (!complaint?._id) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getComplaintMessages(complaint._id);
        const chatData = res.data || res || [];

        // تحويل الرسائل للشكل المطلوب في الـ UI
        const formattedMessages = chatData.map((msg) => ({
          from: msg.sender === "admin" ? "me" : "user", // افتراضي: admin = me, user = user
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Failed to load chat messages:", err);
        toast.error(t("failedToLoadChat") || "Failed to load messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [complaint?._id, t]);

  // إرسال رسالة جديدة
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !complaint?._id) return;

    try {
      setSending(true);
      await sendMessageToComplaint(complaint._id, { message: newMessage });

      // إضافة الرسالة محليًا لتحديث فوري
      const newMsg = {
        from: "me",
        text: newMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      toast.success(t("messageSent") || "Message sent");
    } catch (err) {
      toast.error(t("sendFailed") || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // وقت الشكوى (من تاريخ الإنشاء)
  const complaintTime = complaint?.createdAt
    ? new Date(complaint.createdAt).toLocaleString("ar-EG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "غير معروف";

  return (
    <article className="h-full flex flex-col">
      {/* Header */}
      <section className="p-4 border-b border-[#EAEBEC] dark:border-gray-500">
        <div className="border border-[#EAEBEC] dark:border-gray-500 rounded">
          <div className="flex items-center p-3 gap-2 border-b border-[#EAEBEC] dark:border-gray-500">
            <LuClock8 />
            <p className="font-medium">
              {t("since")} {complaintTime}
            </p>
          </div>
          <p className="p-3 text-xl font-medium">{t("complaintDetails")}</p>
        </div>
      </section>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-[#717171]">
            {t("loading") || "Loading messages..."}
          </div>
        ) : messages.length > 0 ? (
          messages.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-2 my-4"
              style={{
                justifyContent: c.from === "me" ? "start" : "end",
                flexDirection: c.from === "me" ? "row" : "row-reverse",
              }}
            >
              <img
                className="object-cover rounded-full size-6"
                src={
                  c.from === "me"
                    ? "/assets/admin.png"
                    : complaint?.user?.profileImg || "/assets/driver.png"
                }
                alt=""
              />
              <div
                className="p-3 rounded-[8px] max-w-[70%]"
                style={{
                  backgroundColor:
                    c.from === "me" ? "transparent" : "#FFEBCD4D",
                  border: c.from === "me" ? "1px solid #ADC7EF" : "none",
                }}
              >
                <p className="text-[#717171] dark:text-gray-300 break-words">
                  {c.text}
                </p>
                <span className="text-[#85898E] dark:text-gray-200 text-sm block mt-1">
                  {c.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[#717171]">
            {t("noMessages") || "No messages yet"}
          </div>
        )}
      </section>

      {/* Send Message */}
      <section className="p-4 border-t border-[#EAEBEC] dark:border-gray-500">
        <div className="flex items-center gap-2">
          <div className="relative rounded-[7px] bg-[#F9F9F9] p-2 flex items-center flex-1 dark:bg-gray-800">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              className="w-full p-1 bg-transparent focus-visible:outline-none text-[#717171] dark:text-white"
              placeholder={t("writeHere")}
              disabled={sending}
            />
            <GoPaperclip size={20} className="text-[#717171] cursor-pointer" />
          </div>
          <SendIcon
            className="cursor-pointer ltr:rotate-90 text-primary-1"
            onClick={handleSendMessage}
          />
        </div>
      </section>
    </article>
  );
};

export default Chat;
