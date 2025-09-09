import React, { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import addIcon from "../../assets/add.png";
import { Header } from "../../components/common/Header"
import { Link } from "react-router-dom";
import { subscriptionService } from "../../services/Subscriptions";

interface Product {
  img: string;
  name: string;
  count: string;
  url: string;
  id: string;
}

interface FavouriteItem {
  id: string;
  name: string;
  products: Product[];
}

export const Favourites: React.FC = () => {
  // const [favouritesList, setFavouritesList] = useState<FavouriteItem[]>([
  //   {
  //     id: "1",
  //     favouritesListName: "Local Shops",
  //     products: [
  //       { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
  //       { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
  //       { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" },
  //     ]
  //   },
  //   {
  //     id: "2",
  //     favouritesListName: "Online Shopping",
  //     products: [
  //       { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
  //       { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
  //       { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
  //     ]
  //   },
  //   {
  //     id: "3",
  //     favouritesListName: "Clothings",
  //     products: [
  //       { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
  //       { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
  //       { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
  //     ]
  //   },
  //   {
  //     id: "4",
  //     favouritesListName: "Auto",
  //     products: [
  //       { img: KMartImg, name: "Mosquito Zapper - Zap..", count: "1", url: "https://www.walmart.com", id: "987-1234" },
  //       { img: BurgerKingImg, name: "Tyleno - 4 in 1 ...", count: "4", url: "https://www.shoptoday.com/dt-ref?0123", id: "010-1010" },
  //       { img: KMartImg, name: "Crest - Teeth Whitening...", count: "2", url: "https://www.amazon.com/dental-crest", id: "555-8888" }
  //     ]
  //   },
  // ]);

  const [favouritesList, setFavouritesList] = useState<FavouriteItem[]>([]);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [layoutName, setLayoutName] = useState<string>("default");

  useEffect(() => {
    const getSavedFavouritesList = async () => {
      const res = await subscriptionService.getFavouriteFolder();
      console.log("favourites", res?.data)
      setFavouritesList(res?.data);
    }
    getSavedFavouritesList();
  }, [newFolderName])

  const handleAddClick = (): void => {
    setShowKeyboard(true);
  };

  const handleKeyboardInput = (input: string): void => {
    setNewFolderName(input);
  };

  const handleKeyPress = (button: string): void => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    } else if (button === "{enter}") {
      if (newFolderName.trim()) {
        const obj = { "name": newFolderName.trim() };

        // Call API
        subscriptionService.postFavouriteFolder(obj)
          .then(() => {
            // On successful API call, add to local state
            const newFolder: FavouriteItem = {
              id: (favouritesList.length + 1).toString(),
              name: newFolderName.trim(),
              products: []
            };
            setFavouritesList([...favouritesList, newFolder]);
            setNewFolderName("");
            setShowKeyboard(false);
            setLayoutName("default");
          })
          .catch((error) => {
            console.error("Error creating folder:", error);
            // Handle error - you could show a toast/alert here
          });
      }
    } else if (button === "{escape}") {
      setNewFolderName("");
      setShowKeyboard(false);
      setLayoutName("default");
    }
  };

  const closeKeyboard = (): void => {
    setNewFolderName("");
    setShowKeyboard(false);
    setLayoutName("default");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewFolderName(e.target.value);
  };

  return (
    <div className="mt-[26px] flex flex-col justify-center">
      <Header />

      <div className="grid grid-cols-3 gap-[10px] px-6 py-[10px]">
        {favouritesList.map((favouritesItem: FavouriteItem) => (
          <Link key={favouritesItem.id} to={favouritesItem.id}>
            <div className="flex flex-col">
              <div className="rounded-[20px] border-2 border-[#00E5FFFF] p-4 flex justify-center items-center h-[110px]">
                {/* <div className="flex flex-wrap gap-[16px] justify-between">
                  {favouritesItem.products.map((product: Product, index: number) => (
                    <img
                      key={index}
                      src={product.img}
                      alt={product.name}
                      className="w-[30px] h-[30px] object-contain"
                    />
                  ))}
                </div> */}
              </div>
              <p className="text-[14px] font-normal text-[#1A73E8FF] text-center">
                {/* {favouritesItem.favouritesListName} */}
                {favouritesItem.name}
              </p>
            </div>
          </Link>
        ))}

        {/* Add button as a grid item card */}
        <div className="flex items-center -mt-[16px] ml-[40px]">
          <button
            onClick={handleAddClick}
            className="bg-[#1A73E8FF] rounded-full flex justify-center items-center p-4"
            type="button"
          >
            <img src={addIcon} alt="Add new folder" className="w-[40px] h-[40px]" />
          </button>
        </div>
      </div>

      {/* Keyboard Modal Overlay */}
      {showKeyboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md mx-4 mb-4 rounded-lg shadow-lg">
            {/* Input Display */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-[#1A73E8FF]">Enter Folder Name</h3>
                <button
                  onClick={closeKeyboard}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  type="button"
                  aria-label="Close keyboard"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={newFolderName}
                onChange={handleInputChange}
                placeholder="Folder name..."
                className="w-full p-3 border-2 border-[#1A73E8FF] rounded-lg text-center outline-none"
                readOnly
              />
            </div>

            {/* Virtual Keyboard */}
            <div className="p-4">
              <Keyboard
                onChange={handleKeyboardInput}
                onKeyPress={handleKeyPress}
                layoutName={layoutName}
                layout={{
                  default: [
                    "1 2 3 4 5 6 7 8 9 0 {bksp}",
                    "q w e r t y u i o p",
                    "a s d f g h j k l",
                    "{shift} z x c v b n m {shift}",
                    "{space} {enter}"
                  ],
                  shift: [
                    "! @ # $ % ^ & * ( ) {bksp}",
                    "Q W E R T Y U I O P",
                    "A S D F G H J K L",
                    "{shift} Z X C V B N M {shift}",
                    "{space} {enter}"
                  ]
                }}
                display={{
                  '{bksp}': '⌫',
                  '{enter}': 'Enter',
                  '{space}': 'Space',
                  '{shift}': '⇧'
                }}
                theme="hg-theme-default hg-layout-default"
                buttonTheme={[
                  {
                    class: "hg-blue",
                    buttons: "{enter}"
                  },
                  {
                    class: "hg-shift",
                    buttons: "{shift}"
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}


    </div>
  )
}