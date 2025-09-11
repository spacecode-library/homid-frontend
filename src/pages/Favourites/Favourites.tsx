import React, { useEffect, useState } from "react";
import KMartImg from "../../assets/kmart.png";
import BurgerKingImg from "../../assets/burgerKing.png";
import addIcon from "../../assets/add.png";
import { Header } from "../../components/common/Header"
import { Link, useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/Subscriptions";
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  imageUrl: string;
  name: string;
  count: string;
  url: string;
  id: string;
}

interface FavouriteItem {
  id: string;
  name: string;
  items?: Product[];
}

export const Favourites: React.FC = () => {
  const [favouritesList, setFavouritesList] = useState<FavouriteItem[]>([]);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Remove newFolderName from dependency array - only run once on mount
  useEffect(() => {
    const getSavedFavouritesList = async () => {
      try {
        setIsLoading(true);
        const res = await subscriptionService.getFavouriteFolder();
        setFavouritesList(res?.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getSavedFavouritesList();
  }, [])

  const getLayoutClasses = (itemCount: number): string => {
    switch (itemCount) {
      case 1:
        return "w-full h-full flex justify-center items-center";
      case 2:
        return "w-full h-full grid grid-cols-2 gap-1";
      case 3:
        return "flex flex-wrap justify-center items-center gap-2";
      default: // 4 or more
        return "grid grid-cols-2 gap-2 place-items-center";
    }
  };

  const getImageSize = (itemCount: number): string => {
    switch (itemCount) {
      case 1:
        return "w-full h-full object-cover rounded-[12px]";
      case 2:
        return "w-full h-full object-cover rounded-[8px]";
      case 3:
        return "w-[30px] h-[30px]";
      default: // 4 or more
        return "w-[30px] h-[30px]";
    }
  };

  const handleAddClick = (): void => {
    setShowInput(true);
  };

  // Updated handleSave to refresh list after successful save
  const handleSave = async (): Promise<void> => {
    if (newFolderName.trim()) {
      const obj = { "name": newFolderName.trim() };

      try {
        setIsSaving(true);

        // Call API to save folder
        await subscriptionService.postFavouriteFolder(obj);

        // Refresh the list after successful save
        const res = await subscriptionService.getFavouriteFolder();
        setFavouritesList(res?.data);

        setNewFolderName("");
        setShowInput(false);
        toast.success("Folder created successfully!");

      } catch (error) {
        console.error("Error creating folder:", error);
        toast.error("Failed to create folder");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = (): void => {
    setNewFolderName("");
    setShowInput(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewFolderName(e.target.value);
  };

  // Show confirmation dialog
  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setFolderToDelete({ id, name });
    setShowDeleteConfirmation(true);
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setFolderToDelete(null);
  };

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (!folderToDelete) return;

    try {
      setIsDeleting(true);
      const res = await subscriptionService.deleteFavouritesFolder(folderToDelete.id);

      if (res?.success) {
        // Update local state to remove the deleted folder
        setFavouritesList(prev => prev.filter(item => item.id !== folderToDelete.id));
        toast.success(res?.message || "Folder deleted successfully!");
      } else {
        toast.error(res?.message || "Failed to delete folder");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete folder");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setFolderToDelete(null);
    }
  };

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8FF]"></div>
    </div>
  );

  return (
    <>
      <div className="mt-[26px] flex flex-col justify-center">
        <Header />

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-3 gap-[10px] px-6 py-[10px]">
            {favouritesList.map((favouritesItem: FavouriteItem) => {
              const items = favouritesItem?.items || [];
              const itemCount = items.length;
              const displayItems = itemCount > 4 ? items.slice(0, 4) : items;

              return (
                <Link key={favouritesItem.id} to={favouritesItem.id}>
                  <div className="relative flex flex-col">
                    <div className="rounded-[20px] border-2 border-[#00E5FFFF] p-4 flex justify-center items-center h-[110px]">
                      <div className={getLayoutClasses(itemCount)}>
                        {displayItems.map((product: Product, index: number) => (
                          <img
                            key={index}
                            src={product.imageUrl}
                            alt=""
                            className={`${getImageSize(itemCount)} object-contain`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[14px] font-normal text-[#1A73E8FF] text-center">
                      {favouritesItem.name}
                    </p>

                    <button
                      onClick={(e) => handleDeleteClick(e, favouritesItem.id, favouritesItem.name)}
                      className="absolute right-0 -top-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                      type="button"
                      aria-label="Delete folder"
                    >
                      ×
                    </button>
                  </div>
                </Link>
              );
            })}

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
        )}

        {/* Input Modal Overlay */}
        {showInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1A73E8FF]">Enter Folder Name</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  type="button"
                  aria-label="Close"
                  disabled={isSaving}
                >
                  ×
                </button>
              </div>

              <input
                type="text"
                value={newFolderName}
                onChange={handleInputChange}
                placeholder="Folder name..."
                className="w-full p-3 border-2 border-[#1A73E8FF] rounded-lg outline-none bg-white mb-4"
                autoFocus
                disabled={isSaving}
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  type="button"
                  disabled={isSaving}
                >
                  Cancel
                </button>

                {newFolderName.trim() && (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#1A73E8FF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                    type="button"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && folderToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1A73E8FF]">Delete Folder</h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  type="button"
                  aria-label="Close"
                  disabled={isDeleting}
                >
                  ×
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the folder "{folderToDelete.name}"? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  type="button"
                  disabled={isDeleting}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                  type="button"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </>
  )
}