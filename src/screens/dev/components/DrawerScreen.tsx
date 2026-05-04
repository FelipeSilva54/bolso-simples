import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Drawer({
  visible,
  onClose,
  side = 'left',
  children,
}: {
  visible: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
}) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        {side === 'left' ? (
          <>
            <View style={styles.drawer}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
              {children}
            </View>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} />
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} />
            <View style={styles.drawer}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
              {children}
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

export function DrawerScreen() {
  const [active, setActive] = useState<string | null>(null);

  const navItems = [
    { icon: '🏠', label: 'Home' },
    { icon: '💳', label: 'Carteiras' },
    { icon: '📊', label: 'Relatórios' },
    { icon: '⚙️', label: 'Configurações' },
    { icon: '👤', label: 'Perfil' },
  ];

  return (
    <ScreenWrapper>
      <Section title="Posição">
        <Label text="Esquerda (padrão)" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('left')}>
          <Text style={styles.triggerText}>Abrir Drawer — Esquerda</Text>
        </TouchableOpacity>

        <Label text="Direita" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('right')}>
          <Text style={styles.triggerText}>Abrir Drawer — Direita</Text>
        </TouchableOpacity>
      </Section>

      <Drawer visible={active === 'left'} onClose={() => setActive(null)} side="left">
        <View style={styles.drawerHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FS</Text>
          </View>
          <Text style={styles.drawerUser}>Felipe Silva</Text>
          <Text style={styles.drawerEmail}>felipe@email.com</Text>
        </View>
        {navItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={() => setActive(null)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Drawer>

      <Drawer visible={active === 'right'} onClose={() => setActive(null)} side="right">
        <Text style={styles.drawerTitle}>Filtros</Text>
        {['Todas', 'Receitas', 'Despesas', 'Pagas', 'Não pagas'].map((f) => (
          <TouchableOpacity key={f} style={styles.navItem} onPress={() => setActive(null)}>
            <Text style={styles.navLabel}>{f}</Text>
          </TouchableOpacity>
        ))}
      </Drawer>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: 280,
    backgroundColor: colors.card,
    paddingTop: 48,
    paddingBottom: 32,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  closeBtnText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  drawerUser: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  drawerEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  trigger: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
