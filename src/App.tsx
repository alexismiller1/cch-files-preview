/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React, { useState } from "react";
import "@react-spectrum/s2/page.css";
import {
  ActionButton,
  Avatar,
  Divider,
  SearchField,
  Text
} from "@react-spectrum/s2";
import Edit from "@react-spectrum/s2/icons/Edit";
import Contrast from "@react-spectrum/s2/icons/Contrast";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored or system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    const theme = newTheme ? 'dark' : 'light';
    // Apply theme using multiple approaches to ensure compatibility
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.documentElement.style.colorScheme = theme;
    
    // Also apply class-based theming as fallback
    document.documentElement.classList.remove('spectrum--light', 'spectrum--dark', 'spectrum--darkest');
    document.documentElement.classList.add(newTheme ? 'spectrum--dark' : 'spectrum--light');
  };

  // Apply theme on mount and when isDarkMode changes
  React.useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.documentElement.style.colorScheme = theme;
    
    // Also try setting the class-based approach as fallback
    document.documentElement.classList.remove('spectrum--light', 'spectrum--dark', 'spectrum--darkest');
    document.documentElement.classList.add(isDarkMode ? 'spectrum--dark' : 'spectrum--light');
    
    console.log('Theme applied:', theme, 'isDarkMode:', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={style({
      height: "[100vh]",
      backgroundColor: "layer-1",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    })}>
      {/* Header */}
      <header className={style({
        backgroundColor: "layer-1",
        height: "[56px]",
        display: "flex",
        alignItems: "center",
        gap: 12
      })}>
        {/* Start section with logo and project name */}
        <div className="header-start">
          <div className="logo-container">
            <div className="spectrum-logo">
            </div>
          </div>
          <Text styles={style({ font: "ui", fontWeight: "bold", color: "gray-900" })}>
            Project name
          </Text>
        </div>

        {/* Middle section with search */}
        <div className="header-middle">
          <SearchField 
            aria-label="Search" 
            styles={style({ width: "100%", maxWidth: 400 })}
          />
        </div>

        {/* End section with controls */}
        <div className="header-end">
          <ActionButton isQuiet>
            <Edit />
          </ActionButton>
          <Divider orientation="vertical" />
          <ActionButton isQuiet onPress={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Contrast />
          </ActionButton>
          <Avatar />
        </div>
      </header>

      {/* Main content area */}
      <main className="app-main">
        <nav className="app-sidebar">
          {/* Sidebar content */}
        </nav>
      <div className="content-area">
          {/* Content area ready for new content */}
        </div>
      </main>
    </div>
  );
}

export default App;
