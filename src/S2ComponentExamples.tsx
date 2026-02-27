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

/*
 * INSTRUCTION: Keep this file updated with all available Spectrum 2 components
 * 
 * To ensure this file always contains the latest components from @react-spectrum/s2:
 * 1. Check node_modules/@react-spectrum/s2/dist/types.d.ts for new component exports
 * 2. Look for patterns like:
 *    - export const ComponentName: ForwardRefExoticComponent<...>
 *    - export function ComponentName(props: ...): ReactNode
 *    - export const ComponentName: <T extends object>(props: ...) => ReactElement | null
 * 3. Add any missing components to the imports and examples below
 * 4. Update examples to demonstrate the new components' basic usage
 * 
 * This ensures developers can see all available components in one place.
 */

import React, { useState } from "react";
import "@react-spectrum/s2/page.css";
import {
  // Action components
  ActionButton,
  ActionButtonGroup,
  ActionMenu,
  
  // Avatar components
  Avatar,
  
  // Button components
  Button,
  ButtonGroup,
  LinkButton,
  
  // Card components
  Card,
  CardPreview,
  AssetCard,
  
  // Form components
  Checkbox,
  CheckboxGroup,
  NumberField,
  Radio,
  RadioGroup,
  SearchField,
  Switch,
  TextField,
  TextArea,
  
  // Layout components
  Divider,
  Header,
  Content,
  
  // Typography
  Heading,
  Text,
  
  // Menu components
  Menu,
  MenuItem,
  MenuTrigger,
  SubmenuTrigger,
  
  // Picker components
  Picker,
  PickerItem,
  
  // Table components
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
  
  // Tree components
  TreeView,
  TreeViewItem,
  TreeViewItemContent,
  
  // Toggle components
  ToggleButton,
  ToggleButtonGroup,
  
  // Dialog components
  AlertDialog,
  DialogTrigger,
  
  // Progress components
  ProgressBar,
  ProgressCircle,
  Meter,
  
  // Feedback components
  Badge,
  InlineAlert,
  StatusLight,
  
  // Navigation components
  Breadcrumbs,
  Breadcrumb,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  
  // Input components
  Slider,
  
  // Layout utilities
  Tooltip,
  TooltipTrigger,
  
  // Disclosure
  Accordion,
  Disclosure,
  DisclosureHeader,
  DisclosureTitle,
  DisclosurePanel,
  
  // Selection
  SegmentedControl,
  SegmentedControlItem,
  SelectBox,
  SelectBoxGroup,
  
  // Utilities
  ContextualHelp,
  Image,
  NotificationBadge
} from "@react-spectrum/s2";
import Edit from "@react-spectrum/s2/icons/Edit";
import FileTxt from "@react-spectrum/s2/icons/FileText";
import Folder from "@react-spectrum/s2/icons/Folder";
import Contrast from "@react-spectrum/s2/icons/Contrast";
import Section from "./components/Section";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { CardViewExample } from "./components/CardViewExample";
import { CollectionCardsExample } from "./components/CollectionCardsExample";

const Lazy = React.lazy(() => import('./Lazy'));

function App() {
  const [isLazyLoaded, setLazyLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored or system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [cardViewState, setCardViewState] = useState({
    layout: 'grid',
    loadingState: 'idle',
  });
  const cardViewLoadingOptions = [
    {id: 'idle', label: 'Idle'},
    {id: 'loading', label: 'Loading'},
    {id: 'sorting', label: 'Sorting'},
    {id: 'loadingMore', label: 'Loading More'},
    {id: 'error', label: 'Error'},
  ];
  const cardViewLayoutOptions = [
    {id: 'grid', label: 'Grid'},
    {id: 'waterfall', label: 'Waterfall'}
  ];

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
        {/* Start section with logo and product name */}
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
        <div className={`content-area ${style({
          flex: 1,
          backgroundColor: "base",
          borderRadius: "[16px]",
          boxShadow: "[0px 1px 3px 0px rgba(0, 0, 0, 0.04)]",
          marginBottom: 12,
          padding: 24,
          overflowY: "[auto]",
          minHeight: "[0]"
        })}`}>
          <Heading
            styles={style({ font: "heading-xl", textAlign: "center" })}
            level={1}
          >
            Spectrum 2 + React + Vite
          </Heading>
          <div
            className={style({
              maxWidth: 288,
              margin: "auto",
            })}
          >
            <Divider />
          </div>
          <div
            className={style({
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center"
            })}
          >
            <Section title="Buttons">
              <ButtonGroup align="center" styles={style({maxWidth: '[100vw]'})}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <ActionButton>
                  <Edit />
                  <Text>Action button</Text>
                </ActionButton>
                <ToggleButton>Toggle button</ToggleButton>
                <LinkButton
                  variant="primary"
                  href="https://adobe.com"
                  target="_blank"
                >
                  Link button
                </LinkButton>
                <ActionButtonGroup density="compact">
                  <ActionButton>Cut</ActionButton>
                  <ActionButton>Copy</ActionButton>
                  <ActionButton>Paste</ActionButton>
                </ActionButtonGroup>
                <ToggleButtonGroup density="compact" selectionMode="multiple">
                  <ToggleButton id="bold">Bold</ToggleButton>
                  <ToggleButton id="italic">Italic</ToggleButton>
                  <ToggleButton id="underline">Underline</ToggleButton>
                </ToggleButtonGroup>
              </ButtonGroup>
            </Section>

            <Section title="Collections">
              <ActionMenu>
                <MenuItem>Action menu item 1</MenuItem>
                <MenuItem>Action menu item 2</MenuItem>
                <MenuItem>Action menu item 3</MenuItem>
              </ActionMenu>
              <Picker
                label="CardView loading state"
                items={cardViewLoadingOptions}
                selectedKey={cardViewState.loadingState}
                onSelectionChange={loadingState => setCardViewState({...cardViewState, loadingState: loadingState as string})}>
                {item => <PickerItem id={item.id}>{item.label}</PickerItem>}
              </Picker>
              <Picker
                label="CardView layout"
                items={cardViewLayoutOptions}
                selectedKey={cardViewState.layout}
                onSelectionChange={layout => setCardViewState({...cardViewState, layout: layout as string})}>
                {item => <PickerItem id={item.id}>{item.label}</PickerItem>}
              </Picker>
              <CardViewExample {...cardViewState} />
              <Divider styles={style({maxWidth: 320, marginX: 'auto'})} />
              <CollectionCardsExample loadingState={cardViewState.loadingState} />
              <MenuTrigger>
                <ActionButton>Menu</ActionButton>
                <Menu onAction={(key) => alert(key.toString())}>
                  <MenuItem id="cut">Cut</MenuItem>
                  <MenuItem id="copy">Copy</MenuItem>
                  <MenuItem id="paste">Paste</MenuItem>
                  <MenuItem id="replace">Replace</MenuItem>
                  <SubmenuTrigger>
                    <MenuItem id="share">Share</MenuItem>
                    <Menu onAction={(key) => alert(key.toString())}>
                      <MenuItem id="copy-ink">Copy link</MenuItem>
                      <SubmenuTrigger>
                        <MenuItem id="email">Email</MenuItem>
                        <Menu onAction={(key) => alert(key.toString())}>
                          <MenuItem id="attachment">Email as attachment</MenuItem>
                          <MenuItem id="link">Email as link</MenuItem>
                        </Menu>
                      </SubmenuTrigger>
                      <MenuItem id="sms">SMS</MenuItem>
                    </Menu>
                  </SubmenuTrigger>
                  <MenuItem id="delete">Delete</MenuItem>
                </Menu>
              </MenuTrigger>
              <MenuTrigger>
                <ActionButton>Menu trigger</ActionButton>
                <Menu>
                  <MenuItem href="/foo">
                    Link to /foo
                  </MenuItem>
                  <MenuItem>Cut</MenuItem>
                  <MenuItem>Copy</MenuItem>
                  <MenuItem>Paste</MenuItem>
                </Menu>
              </MenuTrigger>
              <TableView aria-label="Files" styles={style({width: 320, height: 320})}>
                <TableHeader>
                  <Column isRowHeader>Name</Column>
                  <Column>Type</Column>
                  <Column>Date modified</Column>
                  <Column>A</Column>
                  <Column>B</Column>
                </TableHeader>
                <TableBody>
                  <Row id="1">
                    <Cell>Games</Cell>
                    <Cell>File folder</Cell>
                    <Cell>6/7/2020</Cell>
                    <Cell>Dummy content</Cell>
                    <Cell>Long long long long long long long cell</Cell>
                  </Row>
                  <Row id="2">
                    <Cell>Program files</Cell>
                    <Cell>File folder</Cell>
                    <Cell>4/7/2021</Cell>
                    <Cell>Dummy content</Cell>
                    <Cell>Long long long long long long long cell</Cell>
                  </Row>
                  <Row id="3">
                    <Cell>bootmgr</Cell>
                    <Cell>System file</Cell>
                    <Cell>11/20/2010</Cell>
                    <Cell>Dummy content</Cell>
                    <Cell>Long long long long long long long cell</Cell>
                  </Row>
                </TableBody>
              </TableView>
              <TreeView disabledKeys={['projects-1']} aria-label="test static tree">
                <TreeViewItem id="Photos" textValue="Photos">
                  <TreeViewItemContent>
                    <Text>Photos</Text>
                    <Folder />
                  </TreeViewItemContent>
                </TreeViewItem>
                <TreeViewItem id="projects" textValue="Projects">
                  <TreeViewItemContent>
                    <Text>Projects</Text>
                    <Folder />
                  </TreeViewItemContent>
                  <TreeViewItem id="projects-1" textValue="Projects-1">
                    <TreeViewItemContent>
                      <Text>Projects-1</Text>
                      <Folder />
                    </TreeViewItemContent>
                    <TreeViewItem id="projects-1A" textValue="Projects-1A">
                      <TreeViewItemContent>
                        <Text>Projects-1A</Text>
                        <FileTxt />
                      </TreeViewItemContent>
                    </TreeViewItem>
                  </TreeViewItem>
                  <TreeViewItem id="projects-2" textValue="Projects-2">
                    <TreeViewItemContent>
                      <Text>Projects-2</Text>
                      <FileTxt />
                    </TreeViewItemContent>
                  </TreeViewItem>
                  <TreeViewItem id="projects-3" textValue="Projects-3">
                    <TreeViewItemContent>
                      <Text>Projects-3</Text>
                      <FileTxt />
                    </TreeViewItemContent>
                  </TreeViewItem>
                </TreeViewItem>
              </TreeView>
            </Section>

            <Section title="Form Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <TextField label="Name" />
                <TextArea label="Description" />
                <NumberField label="Age" defaultValue={25} />
                <SearchField aria-label="Search" />
                <CheckboxGroup label="Preferences">
                  <Checkbox value="newsletter">Subscribe to newsletter</Checkbox>
                  <Checkbox value="updates">Receive updates</Checkbox>
                </CheckboxGroup>
                <RadioGroup label="Size" defaultValue="medium">
                  <Radio value="small">Small</Radio>
                  <Radio value="medium">Medium</Radio>
                  <Radio value="large">Large</Radio>
                </RadioGroup>
                <Switch>Enable notifications</Switch>
                <Slider label="Volume" defaultValue={50} />
              </div>
            </Section>

            <Section title="Feedback Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <Badge variant="positive">Success</Badge>
                <Badge variant="negative">Error</Badge>
                <Badge variant="informative">Info</Badge>
                <StatusLight variant="positive">Online</StatusLight>
                <StatusLight variant="negative">Offline</StatusLight>
                <InlineAlert variant="informative">
                  <Heading>Information</Heading>
                  <Content>This is an informational message.</Content>
                </InlineAlert>
                <ProgressBar label="Loading" value={60} />
                <ProgressCircle aria-label="Loading..." value={75} />
                <Meter label="Storage used" value={80} />
              </div>
            </Section>

            <Section title="Navigation Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <Breadcrumbs>
                  <Breadcrumb href="/">Home</Breadcrumb>
                  <Breadcrumb href="/products">Products</Breadcrumb>
                  <Breadcrumb>Current Page</Breadcrumb>
                </Breadcrumbs>
                <Link href="https://adobe.com" target="_blank">Visit Adobe</Link>
                <Tabs aria-label="Tabs">
                  <TabList>
                    <Tab id="tab1">Tab 1</Tab>
                    <Tab id="tab2">Tab 2</Tab>
                    <Tab id="tab3">Tab 3</Tab>
                  </TabList>
                  <TabPanel id="tab1">Content for Tab 1</TabPanel>
                  <TabPanel id="tab2">Content for Tab 2</TabPanel>
                  <TabPanel id="tab3">Content for Tab 3</TabPanel>
                </Tabs>
              </div>
            </Section>

            <Section title="Card Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <Card>
                  <CardPreview>
                    <Image src="https://via.placeholder.com/200x150" alt="Placeholder" />
                  </CardPreview>
                  <Header>
                    <Heading level={3}>Sample Card</Heading>
                  </Header>
                  <Content>
                    <Text>This is a sample card with content.</Text>
                  </Content>
                </Card>
                <AssetCard>
                  <Header>
                    <Heading level={3}>Asset Card</Heading>
                  </Header>
                  <Content>
                    <Text>Asset-specific card variant.</Text>
                  </Content>
                </AssetCard>
              </div>
            </Section>

            <Section title="Selection Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <SegmentedControl defaultSelectedKey="option1">
                  <SegmentedControlItem id="option1">Option 1</SegmentedControlItem>
                  <SegmentedControlItem id="option2">Option 2</SegmentedControlItem>
                  <SegmentedControlItem id="option3">Option 3</SegmentedControlItem>
                </SegmentedControl>
                <SelectBoxGroup>
                  <SelectBox id="box1">
                    <Header>
                      <Heading level={4}>Option A</Heading>
                    </Header>
                    <Content>
                      <Text>Description for option A</Text>
                    </Content>
                  </SelectBox>
                  <SelectBox id="box2">
                    <Header>
                      <Heading level={4}>Option B</Heading>
                    </Header>
                    <Content>
                      <Text>Description for option B</Text>
                    </Content>
                  </SelectBox>
                </SelectBoxGroup>
              </div>
            </Section>

            <Section title="Disclosure Components">
              <Accordion>
                <Disclosure>
                  <DisclosureHeader>
                    <DisclosureTitle>Section 1</DisclosureTitle>
                  </DisclosureHeader>
                  <DisclosurePanel>
                    <Text>Content for section 1</Text>
                  </DisclosurePanel>
                </Disclosure>
                <Disclosure>
                  <DisclosureHeader>
                    <DisclosureTitle>Section 2</DisclosureTitle>
                  </DisclosureHeader>
                  <DisclosurePanel>
                    <Text>Content for section 2</Text>
                  </DisclosurePanel>
                </Disclosure>
              </Accordion>
            </Section>

            <Section title="Utility Components">
              <div className={style({ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" })}>
                <TooltipTrigger>
                  <ActionButton>Hover me</ActionButton>
                  <Tooltip>This is a helpful tooltip</Tooltip>
                </TooltipTrigger>
                <DialogTrigger>
                  <ActionButton>Open Dialog</ActionButton>
                  <AlertDialog title="Confirmation" variant="confirmation" primaryActionLabel="OK">
                    Are you sure you want to proceed?
                  </AlertDialog>
                </DialogTrigger>
                <ContextualHelp>
                  <Header>
                    <Heading level={3}>Help</Heading>
                  </Header>
                  <Content>
                    <Text>This provides contextual help information.</Text>
                  </Content>
                </ContextualHelp>
                <NotificationBadge value={5} />
              </div>
            </Section>

            {!isLazyLoaded && <ActionButton onPress={() => setLazyLoaded(true)}>Load more</ActionButton>}
            {isLazyLoaded && <React.Suspense fallback={<>Loading</>}>
              <Lazy />
            </React.Suspense>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
