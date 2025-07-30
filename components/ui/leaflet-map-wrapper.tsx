"use client"

import React from "react"
import dynamic from "next/dynamic"

// Dynamic import for React Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-400">Loading map...</span>
    </div>
  ),
})

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false })

// Type definitions for the components
interface MapContainerProps {
  center: [number, number]
  zoom: number
  className?: string
  zoomControl?: boolean
  children?: React.ReactNode
  ref?: React.RefObject<any>
  whenCreated?: (map: any) => void
}

interface TileLayerProps {
  attribution?: string
  url: string
}

interface MarkerProps {
  position: [number, number]
  icon?: any
  eventHandlers?: {
    click?: () => void
  }
  children?: React.ReactNode
}

interface PopupProps {
  children?: React.ReactNode
}

interface ZoomControlProps {
  position?: string
}

// Wrapper components with proper typing
export const LeafletMapContainer = React.forwardRef<any, MapContainerProps>((props, ref) => {
  return <MapContainer {...props} ref={ref} />
})

export const LeafletTileLayer: React.FC<TileLayerProps> = (props) => {
  return <TileLayer {...props} />
}

export const LeafletMarker: React.FC<MarkerProps> = (props) => {
  return <Marker {...props} />
}

export const LeafletPopup: React.FC<PopupProps> = (props) => {
  return <Popup {...props} />
}

export const LeafletZoomControl: React.FC<ZoomControlProps> = (props) => {
  return <ZoomControl {...props} />
}

// Export the raw components for direct use if needed
export { MapContainer, TileLayer, Marker, Popup, ZoomControl }
