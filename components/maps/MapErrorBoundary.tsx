'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Table } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('MapLibre GL Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-96 rounded-2xl border border-zinc-800 bg-[#12151b] p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">
              Map Rendering Temporarily Unavailable
            </h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              WebGL is unavailable or map tiles failed to load. Showing the accessible tabular view instead.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-medium">
              <Table className="w-3.5 h-3.5" />
              <span>Accessible Challenge Table Active</span>
            </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
