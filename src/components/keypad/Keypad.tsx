import React, { useState, useEffect } from 'react';
import { searchService } from '../../services/search';
import { idsService } from '../../services/ids';
import { ErrorAlert } from '../ErrorAlert';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from '../product/Product';
import { subscriptionService } from '../../services/Subscriptions';
import { InActiveId } from '../InActiveId';
import { NotFoundId } from '../NotFoundId';

interface KeypadProps {
  onSubmit?: (searchResult: any) => void;
  showHistory?: boolean;
  className?: string;
}

interface SearchResult {
  imageUrl: string;
  productName: string;
  productUrl?: string;
  description?: string;
  price?: number;
  // Add other properties that your API returns
}

export const Keypad: React.FC<KeypadProps> = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [error, setError] = useState<{ title?: string; message: string; type?: 'error' | 'warning' | 'info' } | null>(null);
  const [status, setStatus] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleKeyPress = (key: string) => {
    if (value.replace(/\D/g, '').length < 8) {
      setValue(prev => prev + key);
      setIsPressed(key);
      setTimeout(() => setIsPressed(null), 150);

      // Vibrate on mobile if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const handleClear = () => {
    setValue('');
    setIsPressed('clear');
    setTimeout(() => setIsPressed(null), 150);

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleSearch = async () => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 8) {
      setError({
        title: 'Invalid ID Format',
        message: 'Please enter a complete 8-digit ID',
        type: 'warning'
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const obj = {
        "homId": digits
      }
      const res = await subscriptionService.postHomIdInfo(obj)
      if (res.success) {
        setSearchResult(res?.data)
      } else {
        setStatus(res?.data?.status);
        setNotFound(res?.data?.notfound);
      }

    } catch (error: any) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  const handleCloseProduct = () => {
    setSearchResult(null);
    setStatus("");
    setNotFound(false);
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [value]);

  const keys = [
    [
      { number: '1', letters: '' },
      { number: '2', letters: 'ABC' },
      { number: '3', letters: 'DEF' }
    ],
    [
      { number: '4', letters: 'GHI' },
      { number: '5', letters: 'JKL' },
      { number: '6', letters: 'MNO' }
    ],
    [
      { number: '7', letters: 'PQRS' },
      { number: '8', letters: 'TUV' },
      { number: '9', letters: 'WXYZ' }
    ],
    [
      { number: 'clear', letters: 'Clear' },
      { number: '0', letters: '' },
      { number: 'enter', letters: 'Enter' }
    ]
  ];

  return (
    <div className='px-10'>
      {/* ID Display */}

      {/* <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex justify-center items-center gap-x-[11px]">
          <div className="flex justify-center items-center text-[#1F54B0] text-[40px] font-semibold"><span className='text-[#379AE6]'>.</span>ID</div>
          <div className="flex justify-center items-center text-[40px] font-semibold">
            {(() => {
              const digits = value.replace(/\D/g, '');

              if (digits.length === 0) {
                return <span className="text-gray-400">0000-0000</span>;
              }

              let display = '';

              // First 4 digits
              for (let i = 0; i < 4; i++) {
                display += i < digits.length ? digits[i] : '0';
              }

              display += '-';

              // Last 4 digits
              for (let i = 4; i < 8; i++) {
                display += i < digits.length ? digits[i] : '0';
              }

              return (
                <>
                  {display.split('').map((char, index) => {
                    let digitPosition = index > 4 ? index - 1 : index;

                    if (char === '-') {
                      return <span key={index} className="text-[#379AE6]">-</span>;
                    }

                    const isFilled = digitPosition < digits.length;
                    return (
                      <span
                        key={index}
                        className={isFilled ? "text-[#379AE6]" : "text-gray-400"}
                      >
                        {char}
                      </span>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex justify-center items-center gap-x-[11px]">
          <div className="flex justify-center items-center text-[#1F54B0] text-[40px] font-semibold"><span className='text-[#379AE6]'>.</span>ID</div>
          <div className="flex justify-center items-center text-[40px] font-semibold">
            {(() => {
              const digits = value.replace(/\D/g, '');

              if (digits.length === 0) {
                return <span className="text-gray-400">0000-0000</span>;
              }

              let display = '';

              // First 4 digits
              for (let i = 0; i < 4; i++) {
                display += i < digits.length ? digits[i] : '0';
              }

              display += '-';

              // Last 4 digits
              for (let i = 4; i < 8; i++) {
                display += i < digits.length ? digits[i] : '0';
              }

              return (
                <>
                  {display.split('').map((char, index) => {
                    let digitPosition = index > 4 ? index - 1 : index;

                    if (char === '-') {
                      return <span key={index} className="text-[#379AE6]">-</span>;
                    }

                    const isFilled = digitPosition < digits.length;

                    return (
                      <motion.span
                        key={index}
                        className={isFilled ? "text-[#379AE6]" : "text-gray-400"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: digitPosition * 0.05,
                          ease: "easeOut"
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>

      {/* Keypad Grid */}

      {/* <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-[53px]"
      >
        <div className="grid grid-cols-3 gap-x-[15px] gap-y-[16px] w-full">
          {keys.map((row, rowIndex) => (
            row.map((key, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (key.number === 'clear') {
                    handleClear();
                  } else if (key.number === 'enter') {
                    handleSearch();
                  } else if (key.number && key.number !== 'clear' && key.number !== 'enter') {
                    handleKeyPress(key.number);
                  }
                }}
                className={`
                  relative h-[90px] rounded-[8px] font-medium transition-all duration-150 border border-[#1F54B0]
                  ${isPressed === key.number ? 'transform scale-95 shadow-inner' : 'shadow-sm hover:shadow-md'}
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  flex flex-col items-center justify-center
                `}
                disabled={loading}
                aria-label={
                  key.number === 'clear' ? 'Clear' :
                    key.number === 'enter' ? 'Enter' :
                      key.number
                }
              >
                {key.number === 'clear' ? (
                  <span className="text-[24px] font-bold leading-none text-[#1F54B0]">Clear</span>
                ) : key.number === 'enter' ? (
                  loading ? (
                    <div className="w-4 h-4 border border-[#1F54B0] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-[24px] font-bold leading-none text-[#1F54B0]">Enter</span>
                  )
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[48px] font-bold leading-none text-[#1F54B0]">{key.number}</span>
                    {key.letters && (
                      <span className="text-[14px] text-[#1F54B0] mt-1">{key.letters}</span>
                    )}
                  </div>
                )}
              </motion.button>
            ))
          ))}
        </div>
      </motion.div> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-[53px]"
      >
        <div className="grid grid-cols-3 gap-x-[15px] gap-y-[16px] w-full">
          {keys.map((row, rowIndex) => (
            row.map((key, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: (rowIndex * 3 + colIndex) * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                whileHover={!loading ? {
                  scale: 1.05,
                  backgroundColor: "rgba(31, 84, 176, 0.05)",
                  borderColor: "rgba(31, 84, 176, 0.8)",
                  transition: { duration: 0.2, type: "spring", stiffness: 400 }
                } : {}}
                whileTap={!loading ? {
                  scale: 0.92,
                  backgroundColor: "rgba(31, 84, 176, 0.1)",
                  borderColor: "rgba(31, 84, 176, 1)",
                  transition: { duration: 0.1, type: "spring", stiffness: 600 }
                } : {}}
                onClick={() => {
                  if (key.number === 'clear') {
                    handleClear();
                  } else if (key.number === 'enter') {
                    handleSearch();
                  } else if (key.number && key.number !== 'clear' && key.number !== 'enter') {
                    handleKeyPress(key.number);
                  }
                }}
                className={`
            relative h-[90px] rounded-[8px] font-medium transition-all duration-200 border border-[#1F54B0]
            ${isPressed === key.number ?
                    'transform scale-90 shadow-inner bg-[rgba(31,84,176,0.1)] border-[#1F54B0]' :
                    'shadow-sm hover:shadow-lg bg-white'
                  }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            flex flex-col items-center justify-center
            active:shadow-inner active:bg-[rgba(31,84,176,0.15)]
            hover:bg-[rgba(31,84,176,0.03)]
          `}
                disabled={loading}
                aria-label={
                  key.number === 'clear' ? 'Clear' :
                    key.number === 'enter' ? 'Enter' :
                      key.number
                }
              >
                <motion.div
                  animate={isPressed === key.number ? {
                    scale: 0.9,
                    transition: { duration: 0.1, type: "spring", stiffness: 500 }
                  } : {
                    scale: 1,
                    transition: { duration: 0.2, type: "spring", stiffness: 300 }
                  }}
                  className="flex flex-col items-center"
                >
                  {key.number === 'clear' ? (
                    <motion.span
                      className="text-[24px] font-bold leading-none text-[#1F54B0]"
                      animate={isPressed === key.number ? {
                        color: "rgba(31, 84, 176, 0.8)",
                        transition: { duration: 0.1 }
                      } : {
                        color: "rgb(31, 84, 176)",
                        transition: { duration: 0.2 }
                      }}
                    >
                      Clear
                    </motion.span>
                  ) : key.number === 'enter' ? (
                    loading ? (
                      <motion.div
                        className="w-4 h-4 border border-[#1F54B0] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <motion.span
                        className="text-[24px] font-bold leading-none text-[#1F54B0]"
                        animate={isPressed === key.number ? {
                          color: "rgba(31, 84, 176, 0.8)",
                          transition: { duration: 0.1 }
                        } : {
                          color: "rgb(31, 84, 176)",
                          transition: { duration: 0.2 }
                        }}
                      >
                        Enter
                      </motion.span>
                    )
                  ) : (
                    <div className="flex flex-col items-center">
                      <motion.span
                        className="text-[48px] font-bold leading-none text-[#1F54B0]"
                        animate={isPressed === key.number ? {
                          scale: 0.95,
                          color: "rgba(31, 84, 176, 0.8)",
                          transition: { duration: 0.1, type: "spring", stiffness: 500 }
                        } : {
                          scale: 1,
                          color: "rgb(31, 84, 176)",
                          transition: { duration: 0.2, type: "spring", stiffness: 300 }
                        }}
                      >
                        {key.number}
                      </motion.span>
                      {key.letters && (
                        <motion.span
                          className="text-[14px] text-[#1F54B0] mt-1"
                          animate={isPressed === key.number ? {
                            scale: 0.95,
                            color: "rgba(31, 84, 176, 0.7)",
                            transition: { duration: 0.1 }
                          } : {
                            scale: 1,
                            color: "rgb(31, 84, 176)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          {key.letters}
                        </motion.span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Ripple effect on press */}
                <motion.div
                  className="absolute inset-0 rounded-[8px] pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isPressed === key.number ? {
                    scale: 1,
                    opacity: [0, 0.3, 0],
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {
                    scale: 0,
                    opacity: 0
                  }}
                  style={{
                    background: "radial-gradient(circle, rgba(31, 84, 176, 0.2) 0%, rgba(31, 84, 176, 0) 70%)"
                  }}
                />
              </motion.button>
            ))
          ))}
        </div>
      </motion.div>

      {/* How to Buy .ID Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <a
          href="/how-to-buy"
          className="text-[20px] text-[#1F54B0] font-semibold leading-none"
        >
          How to Buy .ID
        </a>
        <p className="text-[12px] text-[#666666] leading-none">© 2025 Hom.ID, All Rights Reserved</p>
      </motion.div>

      {
        (status === "pending" || status === "inactive" || status === null) && (
          <div className='z-20 absolute top-[30%] left-0 right-0 px-4'>
            <InActiveId onClose={handleCloseProduct} />
          </div>
        )
      }

      {
        notFound &&
        <div className='z-20 absolute top-[30%] left-0 right-0 px-4'>
          <NotFoundId onClose={handleCloseProduct} />
        </div>
      }


      {
        searchResult !== null &&
        <div className='z-20 absolute top-[30%] left-0 right-0 px-4'>
          <Product searchResult={searchResult} numericId={value} onClose={handleCloseProduct} />
        </div>
      }
    </div>
  );
};