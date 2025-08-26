import React, { useState, useEffect } from 'react';
import { searchService } from '../../services/search';
import { idsService } from '../../services/ids';
import { ErrorAlert } from '../ErrorAlert';
import { AnimatePresence, motion } from 'framer-motion';
import { Product } from '../product/Product';

interface KeypadProps {
  onSubmit?: (searchResult: any) => void;
  showHistory?: boolean;
  className?: string;
}

export const Keypad: React.FC<KeypadProps> = ({ onSubmit, showHistory = false, className = '' }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [error, setError] = useState<{ title?: string; message: string; type?: 'error' | 'warning' | 'info' } | null>(null);

  const formatDisplay = (val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  };

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
    const formattedQuery = formatDisplay(value);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      );

      const response = await Promise.race([
        searchService.searchHomId(formattedQuery),
        timeoutPromise
      ]) as any;

      if (response.data.found) {
        // Try to fetch website metadata using the public endpoint
        let enrichedData = { ...response.data };
        if (response.data.id) {
          try {
            const metadataResponse = await idsService.getPublicMetadata(response.data.id);
            if (metadataResponse.data.metadata) {
              enrichedData = {
                ...response.data,
                websiteIcon: metadataResponse.data.metadata.favicon,
                previewImage: metadataResponse.data.metadata.image || metadataResponse.data.metadata.screenshot,
                description: metadataResponse.data.metadata.description,
                productName: metadataResponse.data.metadata.title || response.data.productName
              };
            }
          } catch (error) {
            // If metadata fetch fails, continue with basic data
            console.log('Failed to fetch metadata:', error);
          }
        }

        setSearchResult(enrichedData);

        if (onSubmit) {
          onSubmit(enrichedData);
        } else {
          setError({
            title: 'ID Found - No Destination',
            message: 'This ID exists but has no destination URL set.',
            type: 'info'
          });
        }
      } else {
        if (onSubmit) {
          onSubmit(response.data);
        } else {
          setError({
            title: 'ID Not Found',
            message: `The ID "${formattedQuery}" hasn't been registered yet.`,
            type: 'info'
          });
        }
        setSearchResult(null);
      }
    } catch (error: any) {
      if (error.message === 'timeout') {
        setError({
          title: 'Search Timeout',
          message: 'The search is taking longer than expected. Please try again.',
          type: 'warning'
        });
      } else {
        setError({
          title: 'Search Failed',
          message: 'Unable to search for the ID. Please check your connection and try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
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
      </motion.div>

      {/* Error Alert */}
      {/* <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <ErrorAlert
              title={error.title}
              message={error.message}
              type={error.type}
              onClose={() => setError(null)}
              autoClose={error.type !== 'error'}
              duration={error.type === 'error' ? 0 : 5000}
            />
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Keypad Grid */}
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
        error &&
        <div className='z-20 absolute top-[30%] left-0 right-0 px-4'>
          <Product />
        </div>
      }
    </div>
  );
};