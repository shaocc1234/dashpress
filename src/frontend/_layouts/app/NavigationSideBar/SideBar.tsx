import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { ChevronRight } from "react-feather";
import { useSessionStorage } from "react-use";

import { Tooltip } from "@/components/app/tooltip";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/components/utils";
import { useAppConfiguration } from "@/frontend/hooks/configuration/configuration.store";
import { CRUD_CONFIG_NOT_FOUND } from "@/frontend/lib/crud-config";
import { useApi } from "@/frontend/lib/data/useApi";
import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";
import type { INavigationMenuItem } from "@/shared/types/menu";

import {
  NAVIGATION_MENU_ENDPOINT,
  SIDE_BAR_WIDTH_VARIATIONS,
} from "./constants";
import { NavigationSkeleton } from "./NavigationSkeleton";
import { ProfileOnNavigation } from "./Profile";
import { RenderNavigation } from "./RenderNavigation";

interface IProps {
  isFullWidth: boolean;
  setIsFullWidth: (value: boolean) => void;
}

export const useNavigationMenuItems = () => {
  return useApi<INavigationMenuItem[]>(NAVIGATION_MENU_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Navigation Menu`),
    defaultData: [],
    persist: true,
  });
};

export function SideBar({ isFullWidth, setIsFullWidth }: IProps) {
  const siteConfig = useAppConfiguration("site_settings");
  const navigationMenuItems = useNavigationMenuItems();

  const [activeItem, setActiveItem$1] = useSessionStorage<
    Record<string, string>
  >(`navigation-current-item`, {});

  const setActiveItem = (depth: number, value: string) => {
    const newValue: Record<string, string> = { ...activeItem, [depth]: value };

    const newValueFiltered = Object.fromEntries(
      typescriptSafeObjectDotEntries(newValue).filter(([key]) => +key <= depth)
    ) as Record<string, string>;

    setActiveItem$1(newValueFiltered);
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode === 66) {
        setIsFullWidth(!isFullWidth);
      }
    },
    [isFullWidth]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <div
      id="gaussian-portal-1"
      className="fixed min-h-dvh transition-all"
      style={{
        maxWidth: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        minWidth: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        width: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        flexBasis: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
      }}
    >
      <div className="flex h-[50px] items-center justify-center bg-[oklch(var(--dp-primary)/95%)]">
        <Link href="/">
          {isFullWidth ? (
            <Image
              className="mt-3 w-28"
              width={112}
              height={28}
              src={siteConfig.data.fullLogo}
              alt="full logo"
            />
          ) : (
            <Image
              className="w-7"
              width={28}
              height={28}
              src={siteConfig.data.logo}
              alt="small logo"
            />
          )}
        </Link>
      </div>
      <div className="flex h-[calc(100dvh-50px)] flex-col justify-between">
        <ScrollArea className="h-[calc(100%-1px)] bg-[oklch(var(--dp-primary)/95%)]">
          <ProfileOnNavigation isFullWidth={isFullWidth} />
          <ViewStateMachine
            loading={navigationMenuItems.isLoading}
            error={navigationMenuItems.error}
            loader={<NavigationSkeleton />}
          >
            <RenderNavigation
              navigation={navigationMenuItems.data}
              isFullWidth={isFullWidth}
              setIsFullWidth={setIsFullWidth}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </ViewStateMachine>
        </ScrollArea>
        <Tooltip isOverAButton text="Use `Ctrl + B` to toggle">
          <Button
            variant="ghost"
            className="h-9 rounded-none bg-[oklch(var(--dp-primary)/85%)] shadow-sm"
            onClick={() => setIsFullWidth(!isFullWidth)}
          >
            <ChevronRight
              className={cn(
                "inline-block size-8 text-white transition-transform",
                {
                  "rotate-180": isFullWidth,
                }
              )}
              aria-label="Toggle Side Bar"
            />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
