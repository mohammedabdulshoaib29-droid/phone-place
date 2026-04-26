import { useMemo, useState, type FormEvent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { products } from '../data/products';
import { requestSupportReply, type SupportChatContext } from '../utils/api';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const starterMessages: ChatMessage[] = [
  {
    id: 'intro',
    role: 'assistant',
    text: 'Ask me about orders, returns, repairs, or product compatibility. If you are signed in, I can also check your latest account-related order details.',
  },
];

const suggestedPrompts = [
  'Where is my latest order?',
  'Can I return a damaged item?',
  'My phone battery drains fast. Which repair should I book?',
  'Which charger is best for my phone?',
];

export default function SupportChat() {
  const { pathname } = useLocation();
  const params = useParams();
  const { token } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const product = useMemo(() => {
    if (!pathname.startsWith('/product/')) {
      return null;
    }

    return products.find((item) => item.id === params.id) || null;
  }, [params.id, pathname]);

  const chatContext = useMemo<SupportChatContext>(() => {
    const context: SupportChatContext = {
      pathname,
      page: 'general',
    };

    if (pathname.startsWith('/product/')) {
      context.page = 'product';
    } else if (pathname.startsWith('/track/')) {
      context.page = 'order-tracking';
    } else if (pathname.startsWith('/book-repair')) {
      context.page = 'repair-booking';
    } else if (pathname.startsWith('/track-repair')) {
      context.page = 'repair-tracking';
    } else if (pathname.startsWith('/returns')) {
      context.page = 'returns';
    }

    if (params.orderId) {
      context.orderId = params.orderId;
    }

    if (product) {
      context.productId = product.id;
      context.productSummary = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stockStatus: product.stockStatus,
        compatibleWith: product.compatibleWith,
      };
    }

    return context;
  }, [params.orderId, pathname, product]);

  const sendMessage = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await requestSupportReply(trimmed, chatContext, token);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: response.reply,
        },
      ]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Support assistant is unavailable right now. Please try again.';
      setError(errorMessage);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          text: 'I could not complete that request just now. You can try again or ask in a shorter way.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(message);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-50 rounded-full border border-gold/25 bg-carbon px-5 py-4 text-xs uppercase tracking-[0.24em] text-gold shadow-2xl shadow-black/25 transition-transform hover:-translate-y-0.5"
      >
        {isOpen ? 'Close Help' : 'AI Help'}
      </button>

      {isOpen && (
        <aside className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[2rem] border border-gold/15 bg-charcoal/95 text-silver shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="border-b border-gold/10 px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Phone Palace Support</p>
            <h2 className="mt-2 font-display text-2xl text-ivory" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              AI Copilot
            </h2>
            <p className="mt-2 text-sm leading-6 text-silver/80">
              {token
                ? 'Signed-in support can answer account questions and store help.'
                : 'Guest support can help with products, returns guidance, and repair questions.'}
            </p>
          </div>

          <div className="max-h-[24rem] space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((entry) => (
              <div
                key={entry.id}
                className={`max-w-[90%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 ${
                  entry.role === 'user'
                    ? 'ml-auto bg-gold text-carbon'
                    : 'border border-gold/10 bg-carbon/80 text-silver'
                }`}
              >
                {entry.text}
              </div>
            ))}

            {loading && (
              <div className="max-w-[90%] rounded-[1.4rem] border border-gold/10 bg-carbon/80 px-4 py-3 text-sm text-silver">
                Thinking through your support question...
              </div>
            )}
          </div>

          <div className="border-t border-gold/10 px-5 py-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-gold/12 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-gold"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask about orders, returns, repairs, or accessories..."
                rows={3}
                className="w-full rounded-[1.4rem] border border-gold/10 bg-carbon/70 px-4 py-3 text-sm text-silver outline-none transition-colors placeholder:text-silver/45 focus:border-gold/30"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-silver/60">
                  {token ? 'Account-aware responses enabled' : 'General store help mode'}
                </p>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="rounded-full bg-gold px-5 py-3 text-xs uppercase tracking-[0.22em] text-carbon disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Send
                </button>
              </div>
            </form>

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          </div>
        </aside>
      )}
    </>
  );
}
