// import { useState, useCallback, useEffect, useRef } from "react";
// import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
// import { marked } from "marked";
// // import { motion } from 'framer-motion'
// import { Spa } from "@mui/icons-material";
// import { LoaderCircleIcon } from "lucide-react";

// const API_URL = "https://openrouter.ai/api/v1/chat/completions";
// const API_KEY = "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";


// const MAX_LENGTH = 2000;

// const Chatbot = () => {
//     const [messages, setMessages] = useState<{ role: string; content: string; expanded?: boolean }[]>([
//         { role: "system", content: "Bạn là một chuyên gia về spa massage trị liệu của công ty SPA Royal. Với câu trả lời ngắn gọn nhất nhưng đầy đủ thông tin cho khách hàng." },
//         // { role: "system", content: "Bạn là một chuyên gia về spa massage trị liệu của công ty SPA Royal." },
//     ]);
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const textareaRef = useRef<HTMLTextAreaElement>(null);

//     // Hàm tự động cuộn xuống khi tin nhắn mới được thêm
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     // Hàm tự động điều chỉnh chiều cao của textarea
//     const adjustTextareaHeight = () => {
//         if (textareaRef.current) {
//             textareaRef.current.style.height = "auto"; // Reset height để tránh giãn quá mức
//             textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`; // Giới hạn max-height = 150px
//         }
//     };

//     // Hàm xử lý tin nhắn đầu vào từ người dùng tránh tình trạng chatbot trả lời không liên quan đến mục đích
//     const checkSpaRelated = (message: string) => {
//         const keywords = ["spa", "massage", "trị liệu", "dược liệu",
//             "thư giãn", "bấm huyệt", "dịch vụ", "dịch vụ massage", "hi", "chào",
//             "các bước", "mô tả", "hello", "à há", "chà", "được", "dc","có", "ok", "vâng","không", "phân vân","kiểu", "nước",
//             "dạ", "đau", "mỏi", "nhức", "giúp", "làm sao", "lưng", "đầu", "gối", "quy trình", "thời gian", "tg", "yeah", "yeb", ":))", "xl","trúng", "tuyển","điểm"];
//         return keywords.some((keyword) => message.toLowerCase().includes(keyword));
//     };


//     // Hàm gửi tin nhắn
//     const sendMessage = useCallback(async () => {
//         if (!input.trim()) return;

//         if (!checkSpaRelated(input)) {
//             setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, tôi chỉ hỗ trợ tiếng việt và các câu hỏi liên quan đến spa massage trị liệu. ✨" }]);
//             setInput("");
//             return;
//         }

//         const userMessage = { role: "user", content: input };
//         const updatedMessages = [...messages, userMessage];

//         setMessages(updatedMessages);
//         setInput("");
//         setLoading(true);

//         try {
//             const response = await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     model: "google/gemma-3-4b-it:free",
//                     messages: updatedMessages,
//                     stream: true,
//                 }),
//             });

//             const reader = response.body?.getReader();
//             const decoder = new TextDecoder();
//             const botReply = { role: "assistant", content: "", expanded: false };

//             setMessages((prev) => [...prev, botReply]);

//             if (reader) {
//                 while (true) {
//                     const { done, value } = await reader.read();
//                     if (done) break;
//                     const chunk = decoder.decode(value, { stream: true }).trim();
//                     chunk.split("\n").forEach((line) => {
//                         if (line.startsWith("data: ")) {
//                             const jsonDataStr = line.substring(6).trim();

//                             // Kiểm tra nếu là "[DONE]" thì bỏ qua
//                             if (jsonDataStr === "[DONE]") return;

//                             try {
//                                 const jsonData = JSON.parse(jsonDataStr);
//                                 const text = jsonData?.choices?.[0]?.delta?.content || "";
//                                 if (text) {
//                                     botReply.content += text;
//                                     setMessages((prev) => {
//                                         const newMessages = [...prev];
//                                         newMessages[newMessages.length - 1] = { ...botReply };
//                                         return newMessages;
//                                     });
//                                 }
//                             } catch (error) {
//                                 console.error("Lỗi khi parse JSON:", error, "Dữ liệu nhận được:", jsonDataStr);
//                             }
//                         }
//                     });

//                 }
//             }
//         } catch (error) {
//             console.error("Lỗi khi gửi tin nhắn:", error);
//         }

//         setLoading(false);
//     }, [input, messages]);

//     return (
//         <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black p-2 rounded-xl flex flex-col">
//             {/* Header */}
//             <h2 className="text-lg font-semibold text-white text-center mb-2 flex items-center justify-center">
//                 <Spa fontSize="small" className="animate-bounce mr-2" />
//                 Chatbot Spa Massage Trị liệu
//             </h2>
    
//             {/* Tin nhắn */}
//             <div
//                 className="flex-1 overflow-y-auto bg-gray-100/20 p-2 rounded-lg space-y-2 dark:bg-gray-800"
//                 style={{ minHeight: "0px" }} // quan trọng để scroll hoạt động đúng
//             >
                
//                 <div className={` flex rounded-xl text-sm max-w-[80%] text-black dark:text-white`}>
//                     <FaRobot className="text-blue-500 mt-1 mr-1" size={50}/>
//                     <p className="bg-white dark:bg-black text-black dark:text-white px-3 py-2 rounded-xl">Chào bạn, SPA Royal luôn sẵn lòng giúp bạn thư giãn và chăm sóc sức khỏe. Bạn có điều gì cần tìm hiểu hoặc muốn đặt lịch hẹn không?</p>
//                 </div>
//                 {messages.slice(1).map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                         {msg.role === "assistant" && <FaRobot className="text-blue-500 mt-1 mr-1" />}
//                         <div
//                             className={`px-3 py-2 rounded-xl text-sm max-w-[80%] text-black dark:text-white ${msg.role === "user" ? "bg-blue-500" : "bg-white dark:bg-black"}`}
//                             style={{
//                                 whiteSpace: "pre-wrap",
//                                 wordBreak: "break-word",
//                                 fontFamily: "revert",
//                             }}
//                         >
//                             {msg.role === "assistant" && msg.content.length > MAX_LENGTH && !msg.expanded ? (
//                                 <>
//                                     <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.slice(0, MAX_LENGTH) + "...") }} />
//                                     <button
//                                         onClick={() =>
//                                             setMessages((prev) => {
//                                                 const newMessages = [...prev];
//                                                 newMessages[idx + 1].expanded = true;
//                                                 return newMessages;
//                                             })
//                                         }
//                                         className="text-blue-300 underline text-xs mt-1"
//                                     >
//                                         Xem thêm
//                                     </button>
//                                 </>
//                             ) : (
//                                 <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
//                             )}
//                         </div>
//                         {msg.role === "user" && <FaUser className="text-gray-600 mt-1 ml-1" />}
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>
    
//             {/* Input */}
//             <div className="flex items-center gap-2 mt-2">
//                 <textarea
//                     ref={textareaRef}
//                     value={input}
//                     onChange={(e) => {
//                         setInput(e.target.value);
//                         adjustTextareaHeight();
//                     }}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             sendMessage();
//                         }
//                     }}
//                     placeholder="Nhập câu hỏi..."
//                     className="flex-1 border p-2 rounded-md resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-800"
//                     disabled={loading}
//                     rows={1}
//                 />
//                 <button
//                     onClick={sendMessage}
//                     disabled={loading}
//                     className="bg-blue-600 text-white p-2 rounded-md flex items-center disabled:bg-gray-400"
//                 >
//                     {loading ? <LoaderCircleIcon className="animate-spin" /> : <FaPaperPlane />}
//                 </button>
//             </div>
//         </div>
//     );
    
// };

// export default Chatbot;


import { useState, useCallback, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
import { marked } from "marked";
import { motion } from 'framer-motion'
import { Spa } from "@mui/icons-material";
import { LoaderCircleIcon } from "lucide-react";
import { getServiceSPA } from "../../service/apiService";
import { ServiceFull } from "../../interface/ServiceSPA_interface";

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY_CHAT
const MAX_LENGTH = 2000;

const Chatbot = () => {
    const [messages, setMessages] = useState<{ role: string; content: string; expanded?: boolean; jsxContent?: JSX.Element[] }[]>([
        { role: "system", content: "Bạn là một chuyên gia về spa massage trị liệu của công ty SPA Royal.Câu trả lời ngắn gọn nhưng đầy đủ thông tin cho người dùng." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [spaServices, setSpaServices] = useState<ServiceFull[]>([]); // Chứa toàn bộ dịch vụ

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    const checkSpaRelated = (message: string) => {
        const keywords = ["spa", "massage", "trị liệu", "dược liệu",
            "thư giãn", "bấm huyệt", "dịch vụ", "dịch vụ massage", "hi", "chào",
            "các bước", "mô tả", "hello", "à há", "chà", "được", "dc", "có", "ok", "vâng", "không", "phân vân", "kiểu", "nước",
            "dạ", "đau", "mỏi", "nhức", "giúp", "làm sao", "lưng", "đầu", "gối", "quy trình", "thời gian", "tg", "yeah", "yeb", ":))", "xl", "trúng", "tuyển", "điểm"];
        return keywords.some((keyword) => message.toLowerCase().includes(keyword));
    };

    const fetchSpaServices = useCallback(async () => {
        try {
            const services: ServiceFull[] = await getServiceSPA();

            if (Array.isArray(services)) {
                setSpaServices(services); // Lưu toàn bộ dịch vụ
            } else {
                throw new Error("Dữ liệu trả về không đúng định dạng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dịch vụ:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "❌ Không thể lấy danh sách dịch vụ. Vui lòng thử lại sau!"
            }]);
        }
    }, []);

    useEffect(() => {
        fetchSpaServices();
    }, [fetchSpaServices]);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        // Yêu cầu trả tất cả dịch vụ
        if (["danh sách dịch vụ", "tất cả dịch vụ"].some(keyword => input.toLowerCase().includes(keyword))) {
            const serviceDetailsElements = spaServices.map((service, index) => (
                <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-900 p-4 rounded-lg mb-4 shadow-sm border border-gray-300 dark:border-gray-700 outline outline-1 outline-gray-400"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            src={service.images[0]}
                            alt="spa-massage"
                            className="w-full sm:w-[140px] h-[90px] object-cover rounded-md flex-shrink-0"
                        />
                        <div className="text-justify w-full">
                            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {service.name}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Thời gian:</strong> {service.duration} phút
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Giá:</strong> {service.price.toLocaleString()}đ
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Loại dịch vụ:</strong> {service.serviceType}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Mô tả:</strong> {service.description || "Không có mô tả"}
                            </p>
                        </div>
                    </div>
                </div>

            ));

            setMessages(prev => [...prev, { role: "assistant", content: "", jsxContent: serviceDetailsElements }]);
            setLoading(false);
            return;
        }

        // Tìm kiếm dịch vụ theo từ khóa
        const searchTerm = input.toLowerCase();
        const matchingServices = spaServices.filter(service =>
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );

        if (matchingServices.length > 0) {
            const serviceDetailsElements = matchingServices.map((service, index) => (
                <div
                key={index}
                className="bg-white/80 dark:bg-gray-900 p-4 rounded-lg mb-4 shadow-sm border border-gray-300 dark:border-gray-700 outline outline-1 outline-gray-400"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={service.images[0]}
                    alt="spa-massage"
                    className="w-full sm:w-[140px] h-[90px] object-cover rounded-md flex-shrink-0"
                  />
                  <div className="text-justify w-full">
                    <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {service.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Thời gian:</strong> {service.duration} phút
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Giá:</strong> {service.price.toLocaleString()}đ
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Loại dịch vụ:</strong> {service.serviceType}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Mô tả:</strong> {service.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
              </div>
              
            ));

            setMessages(prev => [...prev, { role: "assistant", content: "", jsxContent: serviceDetailsElements }]);
            setLoading(false);
            return;
        }

        if (!checkSpaRelated(input)) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "⚠ Xin lỗi, tôi chỉ hỗ trợ các câu hỏi liên quan đến **spa massage trị liệu**."
            }]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemma-3-4b-it:free",// openchat/openchat-7b:free
                    messages: updatedMessages,
                    stream: true,
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            const botReply = { role: "assistant", content: "", expanded: false };

            setMessages((prev) => [...prev, botReply]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true }).trim();
                    chunk.split("\n").forEach((line) => {
                        if (line.startsWith("data: ")) {
                            const jsonDataStr = line.substring(6).trim();
                            if (jsonDataStr === "[DONE]") return;

                            try {
                                const jsonData = JSON.parse(jsonDataStr);
                                const text = jsonData?.choices?.[0]?.delta?.content || "";
                                if (text) {
                                    botReply.content += text;
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = { ...botReply };
                                        return newMessages;
                                    });
                                }
                            } catch (error) {
                                console.error("Lỗi khi parse JSON:", error);
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
        setLoading(false);
    }, [input, messages, spaServices]);

    // return (
    //     <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">

    //         <motion.div className="w-full sm:w-[90vw] mx-auto p-6 bg-white/20 rounded-xl shadow-lg border border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 dark:border-gray-500">
    //             <h2 className="text-xl font-semibold text-center mb-4 flex justify-center items-center gap-2">
    //                 <Spa fontSize="large" className="animate-bounce" />
    //                 Chatbot Spa Massage Trị liệu
    //             </h2>

    //             <div className="overflow-y-auto p-4 rounded-lg space-y-3 dark:bg-gray-800" style={{ maxHeight: "70vh", minHeight: "200px" }}>
    //                 {messages.slice(1).map((msg, idx) => (
    //                     <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
    //                         {msg.role === "assistant" && <FaRobot className="text-blue-500 mt-2 mr-2" />}
    //                         <div className={`px-4 py-2 rounded-xl text-black dark:text-white ${msg.role === "user" ? "bg-blue-500" : "bg-white/20 dark:bg-black"}`}
    //                             style={{ maxWidth: "85%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    //                         >
    //                             {msg.jsxContent ? (
    //                                 msg.jsxContent
    //                             ) : msg.role === "assistant" && msg.content.length > MAX_LENGTH && !msg.expanded ? (
    //                                 <>
    //                                     <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.slice(0, MAX_LENGTH) + "...") }} />
    //                                     <button
    //                                         onClick={() => {
    //                                             const updated = [...messages];
    //                                             updated[idx + 1].expanded = true;
    //                                             setMessages(updated);
    //                                         }}
    //                                         className="text-blue-300 underline text-sm mt-1"
    //                                     >
    //                                         Xem thêm
    //                                     </button>
    //                                 </>
    //                             ) : (
    //                                 <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
    //                             )}
    //                         </div>
    //                         {msg.role === "user" && <FaUser className="text-gray-600 mt-2 ml-2" />}
    //                     </div>

    //                 ))}
    //                 <div ref={messagesEndRef} />
    //             </div>

    //             {/* Nhập tin nhắn */}
    //             <div className="flex items-center gap-2 mt-4">
    //                 <textarea
    //                     ref={textareaRef}
    //                     value={input}
    //                     onChange={(e) => {
    //                         setInput(e.target.value);
    //                         adjustTextareaHeight();
    //                     }}
    //                     onKeyDown={(e) => {
    //                         if (e.key === "Enter" && !e.shiftKey) {
    //                             e.preventDefault();
    //                             sendMessage();
    //                         }
    //                     }}
    //                     placeholder="Nhập câu hỏi..."
    //                     className="flex-1 border p-3 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
    //                     disabled={loading}
    //                     rows={1}
    //                 />
    //                 <button
    //                     onClick={sendMessage}
    //                     disabled={loading}
    //                     className="bg-blue-600 text-white p-3 rounded-lg flex items-center disabled:bg-gray-400 transition-all"
    //                 >
    //                     {loading ? <LoaderCircleIcon className="animate-spin" /> : <FaPaperPlane />}
    //                 </button>
    //             </div>
    //         </motion.div>
    //     </div>
    // );

    return (
        <div className="w-full h-full p-2 bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-xl overflow-hidden">
            <div className="flex flex-col h-full bg-white/20 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-center gap-2 p-3 border-b border-gray-300 dark:border-gray-600">
                    <Spa fontSize="large" className="text-purple-300 animate-bounce" />
                    <h2 className="text-lg font-semibold text-white">Chatbot Spa Massage Trị liệu</h2>
                </div>

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.slice(1).map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && <FaRobot className="text-blue-400 mt-2 mr-2" />}
                            <div
                                className={`px-4 py-2 rounded-xl text-black dark:text-white ${msg.role === "user" ? "bg-blue-500" : "bg-white/20 dark:bg-black"}`}
                                style={{ maxWidth: "85%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                                {msg.jsxContent ? (
                                    msg.jsxContent
                                ) : msg.role === "assistant" && msg.content.length > MAX_LENGTH && !msg.expanded ? (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.slice(0, MAX_LENGTH) + "...") }} />
                                        <button
                                            onClick={() => {
                                                const updated = [...messages];
                                                updated[idx + 1].expanded = true;
                                                setMessages(updated);
                                            }}
                                            className="text-blue-300 underline text-sm mt-1"
                                        >
                                            Xem thêm
                                        </button>
                                    </>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                                )}
                            </div>
                            {msg.role === "user" && <FaUser className="text-gray-600 mt-2 ml-2" />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
    
                {/* Input */}
                <div className="flex items-center gap-2 p-3 border-t border-gray-300 dark:border-gray-600">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Nhập câu hỏi..."
                        className="flex-1 border p-3 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                        disabled={loading}
                        rows={1}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg flex items-center disabled:bg-gray-400 transition-all"
                    >
                        {loading ? <LoaderCircleIcon className="animate-spin" /> : <FaPaperPlane />}
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default Chatbot;