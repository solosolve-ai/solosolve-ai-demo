import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Image as ImageIcon, X, Star } from 'lucide-react'; // Using Image as ImageIcon, and X for removal

// Assuming these UI components exist in src/components/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming ScrollArea exists
import { Card } from '@/components/ui/card'; // Keep Card for message bubbles if needed

// Define message types
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

// Define the form schema for the input area (message text and ASIN combined initially)
const chatInputSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
  product_asin: z.string().optional(), // Make optional here, will handle required logic
});

type ChatInputValues = z.infer<typeof chatInputSchema>;

function SubmitComplaint() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [productAsin, setProductAsin] = useState<string>('');
  const [asinError, setAsinError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Keep as File[] for upload
  const [userRating, setUserRating] = useState<number | null>(null); // State for user rating
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatForm = useForm<ChatInputValues>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      message: '',
      product_asin: '',
    },
  });

  const { handleSubmit: handleChatSubmit, reset: resetChatInput, formState: { isValid: isMessageValid } } = chatForm;

  // Effect to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending a user message
  async function sendUserMessage(values: ChatInputValues) {
    if (!productAsin) {
      setAsinError('Product ASIN is required before submitting a complaint.');
      return;
    }
    setAsinError(null);

    const newMessage: Message = {
      id: messages.length + 1,
      text: values.message,
      sender: 'user',
    };

    // If there are selected files, add their names to the user message for display
    let messageText = values.message;
    if (selectedFiles.length > 0) {
        const fileNames = selectedFiles.map(file => file.name).join(', ');
        messageText = `${values.message}

Attached images: ${fileNames}`;
    }

    // Add rating to displayed message if provided
    if (userRating !== null) {
        messageText = `${messageText}

My rating: ${userRating} star${userRating > 1 ? 's' : ''}`;
    }

     const messageToSend: Message = { ...newMessage, text: messageText };


    setMessages([...messages, messageToSend]);
    resetChatInput(); // Clear the input field
    setSelectedFiles([]); // Clear selected files after sending
    setUserRating(null); // Clear rating after sending
    setIsLoading(true);

    // TODO: Get user_id from your authentication context
    const userId = 'user-123'; // Placeholder user ID

    // TODO: Implement file upload logic here.
    // You will need to upload the files (selectedFiles) to a storage service (like Firebase Storage).
    // Get the URLs of the uploaded files.
    const imageUrls: string[] = []; // Placeholder for uploaded image URLs
    console.log('Simulating image upload for:', selectedFiles.map(file => file.name));
    // After upload, populate imageUrls array
    // Example: imageUrls = ['url1', 'url2'];

    // TODO: Implement the actual API call to the backend endpoint
    console.log('Sending message to backend:', {
        user_id: userId,
        complaint_text: values.message, // Send original message text without file names
        product_asin: productAsin,
        image_urls: imageUrls, // Send the actual image URLs here
        user_perceived_rating: userRating, // Send the user's rating
        // Include other necessary fields from your backend API spec
        // channel_of_complaint: 'web',
    });

    // Simulate an API response (replace with actual fetch call)
    setTimeout(() => {
      const aiResponseText = `Thank you for your message about product ASIN ${productAsin}${selectedFiles.length > 0 ? ' and the attached images' : ''}${userRating !== null ? ` with a ${userRating}-star rating` : ''}. I am processing your complaint. (Simulated AI Response)`;
      const aiResponse: Message = {
        id: messages.length + 2,
        text: aiResponseText, // Replace with AI's formal_answer_to_customer
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }, 1500);
  }

  const handleASINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductAsin(e.target.value);
    if (asinError && e.target.value) {
      setAsinError(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
          // Convert FileList to Array and add to state
          // Filter to ensure only image types are processed, although accept attribute helps
          const imageFiles = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
          setSelectedFiles(prevFiles => [...prevFiles, ...imageFiles]);
          // Clear the input value to allow selecting the same file again if needed
          event.target.value = '';
      }
  };

  const handleRemoveFile = (fileName: string) => {
      setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const triggerFileInput = () => {
      fileInputRef.current?.click();
  };

  const handleRatingClick = (rating: number) => {
      setUserRating(userRating === rating ? null : rating); // Toggle rating
  };


  return (
    <div className="flex flex-col h-screen bg-navy text-white">
      {/* Header or initial greeting */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-grow text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Hi I'm your SoloSolver
          </h1>
           {/* ASIN input integrated above the chat input */}
          <div className="w-full max-w-md mb-4">
             <Form {...chatForm}> {/* Using chatForm context, though ASIN managed by state */}
              <FormField
                control={chatForm.control} // Using chatForm control for Zod validation if needed later
                name="product_asin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 sr-only">Product Identifier (ASIN)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Product ASIN to start"
                        className="bg-navy-light text-white border border-gray-700 focus:border-primary text-center placeholder:text-center"
                        value={productAsin}
                        onChange={handleASINChange}
                        // {...field} // Comment out to manage state manually for now
                      />
                    </FormControl>
                    {asinError && <p className="text-red-500 text-sm mt-1">{asinError}</p>}
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
             </Form>
          </div>
           <p className="text-xl text-gray-300">How can I help?</p>
        </div>
      )}

      {/* Chat Messages Area */}
      {messages.length > 0 && (
        <ScrollArea className="flex-grow p-4">
          <div className="flex flex-col space-y-4 pb-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground break-words' // User message style + word break
                      : 'bg-gray-700 text-white break-words' // AI message style + word break
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {/* This div is for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="w-full px-4 pb-4">
        <div className="max-w-2xl mx-auto">
           {/* Display selected file names */}
           {selectedFiles.length > 0 && (
               <div className="mb-2 text-sm text-gray-300 flex flex-wrap items-center gap-2">
                   <span>Attached images:</span>
                   {selectedFiles.map((file, index) => (
                       <span key={index} className="flex items-center bg-gray-700 text-white px-2 py-1 rounded">
                           {file.name}
                           <button
                                type="button"
                                onClick={() => handleRemoveFile(file.name)}
                                className="ml-1 text-gray-400 hover:text-white focus:outline-none"
                           >
                               <X size={14} />
                           </button>
                       </span>
                   ))}
               </div>
           )}
            {/* Rating buttons */}
           {messages.length === 0 && productAsin && (
               <div className="mb-4 flex items-center justify-center space-x-2 text-gray-300">
                   <span>How was your experience?</span>
                   <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRatingClick(1)}
                        className={`
                            ${userRating === 1 ? 'text-primary hover:text-primary-foreground' : 'text-gray-400 hover:text-white'}
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isLoading}
                   >
                       <Star size={24} fill={userRating === 1 ? 'currentColor' : 'none'} />
                       <span className="sr-only">1 star</span>
                   </Button>
                   <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRatingClick(2)}
                         className={`
                            ${userRating === 2 ? 'text-primary hover:text-primary-foreground' : 'text-gray-400 hover:text-white'}
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={isLoading}
                   >
                       <Star size={24} fill={userRating === 2 ? 'currentColor' : 'none'} />
                       <Star size={24} fill={userRating === 2 ? 'currentColor' : 'none'} className="-ml-2" />{/* Second star for 2 */}
                       <span className="sr-only">2 stars</span>
                   </Button>
               </div>
           )}
           <Form {...chatForm}>
            <form onSubmit={handleChatSubmit(sendUserMessage)} className="flex items-center space-x-2">
               {/* ASIN input remains visible even after first message, styled subtly */}
              {messages.length > 0 && (
                <div className="flex-shrink-0">
                  <FormField
                    control={chatForm.control}
                     name="product_asin"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="sr-only">ASIN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ASIN"
                            className="w-24 bg-navy-light text-white border border-gray-700 focus:border-primary text-xs"
                            value={productAsin}
                            onChange={handleASINChange}
                            // {...field} // Comment out to manage state manually for now
                           />
                        </FormControl>
                         {/* <FormMessage /> // Hide message here */}
                      </FormItem>
                    )}
                  />
                </div>
              )}

               <FormField
                control={chatForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow m-0">
                    <FormControl>
                      <div className="relative flex items-center">
                        <Textarea
                          placeholder={productAsin ? "Type your complaint details here..." : "Enter Product ASIN above first..."}
                          className="min-h-[40px] resize-none bg-navy-light text-white border border-gray-700 focus:border-primary pr-10"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && productAsin && !isLoading && (isMessageValid || selectedFiles.length > 0)) {
                              e.preventDefault();
                              chatForm.handleSubmit(sendUserMessage)();
                            }
                          }}
                          disabled={!productAsin || isLoading}
                        />
                         {/* File upload input */}
                         <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            hidden
                            accept="image/*" // Accept only image types
                            onChange={handleFileSelect}
                         />
                         {/* Image upload button */}
                         <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute bottom-1 right-1 h-8 w-8 text-gray-400 hover:text-primary"
                            onClick={triggerFileInput}
                            disabled={isLoading}
                         >
                             <ImageIcon size={20} /> {/* Use ImageIcon */}
                             <span className="sr-only">Attach Image</span>
                         </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" size="icon" disabled={!productAsin || isLoading || (!isMessageValid && selectedFiles.length === 0)}>
                 {isLoading ? (
                   <Loader2 className="h-4 w-4 animate-spin" />
                 ) : (
                   // Replace with a Send icon like ArrowUp if available in lucide-react or similar
                   <span>Send</span> // Placeholder for Send icon
                 )}
               </Button>
             </form>
             {asinError && messages.length > 0 && <p className="text-red-500 text-sm mt-1 text-center">{asinError}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SubmitComplaint;
