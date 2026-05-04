import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DesignSystemParamList } from './types';
import { DesignSystemScreen } from './DesignSystemScreen';
import { AccordionScreen } from './components/AccordionScreen';
import { ActionSheetScreen } from './components/ActionSheetScreen';
import { AlertScreen } from './components/AlertScreen';
import { AlertDialogScreen } from './components/AlertDialogScreen';
import { AvatarScreen } from './components/AvatarScreen';
import { BadgeScreen } from './components/BadgeScreen';
import { BottomSheetScreen } from './components/BottomSheetScreen';
import { ButtonScreen } from './components/ButtonScreen';
import { CardScreen } from './components/CardScreen';
import { CheckboxScreen } from './components/CheckboxScreen';
import { DividerScreen } from './components/DividerScreen';
import { DrawerScreen } from './components/DrawerScreen';
import { FABScreen } from './components/FABScreen';
import { FormControlScreen } from './components/FormControlScreen';
import { HeadingScreen } from './components/HeadingScreen';
import { IconScreen } from './components/IconScreen';
import { ImageScreen } from './components/ImageScreen';
import { InputScreen } from './components/InputScreen';
import { LayoutScreen } from './components/LayoutScreen';
import { LinkScreen } from './components/LinkScreen';
import { MenuScreen } from './components/MenuScreen';
import { ModalScreen } from './components/ModalScreen';
import { PopoverScreen } from './components/PopoverScreen';
import { PressableScreen } from './components/PressableScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { RadioScreen } from './components/RadioScreen';
import { SelectScreen } from './components/SelectScreen';
import { SkeletonScreen } from './components/SkeletonScreen';
import { SliderScreen } from './components/SliderScreen';
import { SpinnerScreen } from './components/SpinnerScreen';
import { SwitchScreen } from './components/SwitchScreen';
import { TableScreen } from './components/TableScreen';
import { TextScreen } from './components/TextScreen';
import { TextareaScreen } from './components/TextareaScreen';
import { ToastScreen } from './components/ToastScreen';
import { TooltipScreen } from './components/TooltipScreen';

const Stack = createNativeStackNavigator<DesignSystemParamList>();

const screenOptions = {
  headerBackTitle: 'Voltar',
  headerStyle: { backgroundColor: '#FFFFFF' },
  headerTintColor: '#111827',
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '600' as const },
};

export function DesignSystemNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={DesignSystemScreen} options={{ title: 'Design System' }} />
        <Stack.Screen name="Accordion" component={AccordionScreen} options={{ title: 'Accordion' }} />
        <Stack.Screen name="ActionSheet" component={ActionSheetScreen} options={{ title: 'ActionSheet' }} />
        <Stack.Screen name="Alert" component={AlertScreen} options={{ title: 'Alert' }} />
        <Stack.Screen name="AlertDialog" component={AlertDialogScreen} options={{ title: 'AlertDialog' }} />
        <Stack.Screen name="Avatar" component={AvatarScreen} options={{ title: 'Avatar' }} />
        <Stack.Screen name="Badge" component={BadgeScreen} options={{ title: 'Badge' }} />
        <Stack.Screen name="BottomSheet" component={BottomSheetScreen} options={{ title: 'BottomSheet' }} />
        <Stack.Screen name="Button" component={ButtonScreen} options={{ title: 'Button' }} />
        <Stack.Screen name="Card" component={CardScreen} options={{ title: 'Card' }} />
        <Stack.Screen name="Checkbox" component={CheckboxScreen} options={{ title: 'Checkbox' }} />
        <Stack.Screen name="Divider" component={DividerScreen} options={{ title: 'Divider' }} />
        <Stack.Screen name="Drawer" component={DrawerScreen} options={{ title: 'Drawer' }} />
        <Stack.Screen name="FAB" component={FABScreen} options={{ title: 'FAB' }} />
        <Stack.Screen name="FormControl" component={FormControlScreen} options={{ title: 'FormControl' }} />
        <Stack.Screen name="Heading" component={HeadingScreen} options={{ title: 'Heading' }} />
        <Stack.Screen name="Icon" component={IconScreen} options={{ title: 'Icon' }} />
        <Stack.Screen name="Image" component={ImageScreen} options={{ title: 'Image' }} />
        <Stack.Screen name="Input" component={InputScreen} options={{ title: 'Input' }} />
        <Stack.Screen name="Layout" component={LayoutScreen} options={{ title: 'Layout' }} />
        <Stack.Screen name="Link" component={LinkScreen} options={{ title: 'Link' }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
        <Stack.Screen name="Modal" component={ModalScreen} options={{ title: 'Modal' }} />
        <Stack.Screen name="Popover" component={PopoverScreen} options={{ title: 'Popover' }} />
        <Stack.Screen name="Pressable" component={PressableScreen} options={{ title: 'Pressable' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progress' }} />
        <Stack.Screen name="Radio" component={RadioScreen} options={{ title: 'Radio' }} />
        <Stack.Screen name="Select" component={SelectScreen} options={{ title: 'Select' }} />
        <Stack.Screen name="Skeleton" component={SkeletonScreen} options={{ title: 'Skeleton' }} />
        <Stack.Screen name="Slider" component={SliderScreen} options={{ title: 'Slider' }} />
        <Stack.Screen name="Spinner" component={SpinnerScreen} options={{ title: 'Spinner' }} />
        <Stack.Screen name="Switch" component={SwitchScreen} options={{ title: 'Switch' }} />
        <Stack.Screen name="Table" component={TableScreen} options={{ title: 'Table' }} />
        <Stack.Screen name="Text" component={TextScreen} options={{ title: 'Text' }} />
        <Stack.Screen name="Textarea" component={TextareaScreen} options={{ title: 'Textarea' }} />
        <Stack.Screen name="Toast" component={ToastScreen} options={{ title: 'Toast' }} />
        <Stack.Screen name="Tooltip" component={TooltipScreen} options={{ title: 'Tooltip' }} />
    </Stack.Navigator>
  );
}
