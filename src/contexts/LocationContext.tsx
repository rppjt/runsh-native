import type { LocationSharingRequest } from "@/api/locationSharingRequest";
import type { LocationSharingResponse } from "@/api/locationSharingResponse";
import { useGetLocationSharingStatus, useSetLocationSharing } from "@/api/user-location/user-location";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface LocationContextType {
  isSharing: boolean;
  toggleSharing: () => void;
  showFriendsOnMap: boolean;
  toggleShowFriends: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const { accessToken, isAuthReady } = useAuth();

  const [isSharing, setIsSharing] = useState(false);
  const [showFriendsOnMap, setShowFriendsOnMap] = useState<boolean>(() => {
    const stored = localStorage.getItem("showFriendsOnMap");
    return stored === null ? true : stored === "true";
  });

  // ✅ 위치 공유 상태 가져오기 (enabled 조건으로 auth 체크)
  const {
    data: sharingData,
    refetch,
    isSuccess,
  } = useGetLocationSharingStatus({
    query: {
      enabled: !!accessToken && isAuthReady,
    },
  });

  useEffect(() => {
    if (isSuccess && sharingData?.isSharing !== undefined) {
      setIsSharing(sharingData.isSharing);
    }
  }, [isSuccess, sharingData]);

  // ✅ 위치 공유 상태 토글 (PATCH)
  const { mutateAsync: setSharingStatus } = useSetLocationSharing();

  const toggleSharing = async () => {
    const next: boolean = !isSharing;
    const payload: { data: LocationSharingRequest } = { data: { isSharing: next } };

    try {
      const res: LocationSharingResponse = await setSharingStatus(payload);
      if (res.isSharing !== undefined) {
        setIsSharing(res.isSharing);
      }
      if (res.message) {
        alert(res.message);
      }
    } catch (err) {
      console.error("📛 위치 공유 상태 변경 실패:", err);
      alert("❌ 위치 공유 상태 변경에 실패했습니다.");
    }
  };

  const toggleShowFriends = () => {
    const next = !showFriendsOnMap;
    setShowFriendsOnMap(next);
    localStorage.setItem("showFriendsOnMap", next.toString());
  };

  return (
    <LocationContext.Provider
      value={{
        isSharing,
        toggleSharing,
        showFriendsOnMap,
        toggleShowFriends,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext는 LocationProvider 내부에서만 사용해야 합니다.");
  }
  return context;
};
