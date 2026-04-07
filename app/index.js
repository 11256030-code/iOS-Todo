import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { List, ChevronRight, PlusCircle, CheckCircle2, Circle, Trash2, ArrowLeft, Pencil, Star } from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [todos, setTodos] = useState([
    { id: '1', text: '完成 React Native 作業', completed: false, catId: '1' },
    { id: '2', text: '上傳 GitHub 原始碼', completed: false, catId: '3' },
  ]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);

  // 分類清單：這裡已經把「旗標」改成了「重要事項」，並換成紫色與星星圖示
  const categories = [
    { id: '1', title: '今日事項', color: '#007AFF', count: todos.filter(t => t.catId === '1').length, icon: 'list' },
    { id: '2', title: '預計', color: '#FF9500', count: todos.filter(t => t.catId === '2').length, icon: 'list' },
    { id: '3', title: '全部', color: '#8E8E93', count: todos.length, icon: 'list' },
    { id: '4', title: '重要事項', color: '#AF52DE', count: todos.filter(t => t.catId === '4').length, icon: 'star' },
  ];

  const handleAction = () => {
    if (!inputText.trim()) return;
    if (editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...t, text: inputText } : t));
      setEditingId(null);
    } else {
      setTodos([...todos, { id: Date.now().toString(), text: inputText, completed: false, catId: activeTab.id }]);
    }
    setInputText('');
  };

  if (activeTab) {
    const listData = activeTab.id === '3' ? todos : todos.filter(t => t.catId === activeTab.id);
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {setActiveTab(null); setEditingId(null); setInputText('');}}>
          <ArrowLeft color={activeTab.color} size={28} />
          <Text style={{color: activeTab.color, fontSize: 18, fontWeight: '600'}}>清單</Text>
        </TouchableOpacity>
        
        <Text style={[styles.mainTitle, {color: activeTab.color}]}>{activeTab.title}</Text>
        
        <FlatList data={listData} keyExtractor={item => item.id} renderItem={({item}) => (
          <View style={styles.todoRow}>
            <TouchableOpacity onPress={() => setTodos(todos.map(t => t.id === item.id ? {...t, completed: !t.completed} : t))}>
              {item.completed ? <CheckCircle2 color={activeTab.color} size={24} /> : <Circle color="#C7C7CC" size={24} />}
            </TouchableOpacity>
            <Text style={[styles.todoText, item.completed && styles.todoDone]}>{item.text}</Text>
            <TouchableOpacity onPress={() => {setEditingId(item.id); setInputText(item.text);}} style={{marginRight: 15}}><Pencil color="#007AFF" size={20} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setTodos(todos.filter(t => t.id !== item.id))}><Trash2 color="#FF3B30" size={20} /></TouchableOpacity>
          </View>
        )} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.inputBar}>
            <TextInput style={styles.textInput} placeholder={editingId ? "修改事項..." : "新提醒事項..."} value={inputText} onChangeText={setInputText} onSubmitEditing={handleAction} />
            <TouchableOpacity onPress={handleAction}><Text style={[styles.addBtn, {color: activeTab.color}]}>{editingId ? "儲存" : "新增"}</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>我的清單</Text>
      <View style={styles.grid}>
        {categories.map(c => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => setActiveTab(c)}>
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, {backgroundColor: c.color}]}>
                {c.icon === 'star' ? <Star color="white" size={20} fill="white" /> : <List color="white" size={20} />}
              </View>
              <Text style={styles.cardCount}>{c.count}</Text>
            </View>
            <Text style={styles.cardLabel}>{c.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  mainTitle: { fontSize: 34, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  card: { backgroundColor: 'white', width: '45%', borderRadius: 15, padding: 15, margin: '2.5%', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  iconBox: { width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardCount: { fontSize: 24, fontWeight: 'bold' },
  cardLabel: { fontSize: 17, color: '#8E8E93', fontWeight: 'bold' },
  todoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: '#C7C7CC', marginHorizontal: 20 },
  todoText: { flex: 1, marginLeft: 12, fontSize: 17 },
  todoDone: { color: '#8E8E93', textDecorationLine: 'line-through' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderTopWidth: 0.5, borderTopColor: '#CCC' },
  textInput: { flex: 1, backgroundColor: '#F2F2F7', padding: 12, borderRadius: 10, fontSize: 16 },
  addBtn: { marginLeft: 15, fontWeight: 'bold', fontSize: 17 }
});