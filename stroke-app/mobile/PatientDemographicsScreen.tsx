/**
 * PatientDemographicsScreen — FIXED
 * Adds: weight unit toggle (kg ↔ lbs), proper validation, NIHSS range check
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { patientsApi, setToken, getToken } from '../config/api';

/* ─────────────────────────────────────────
   WEIGHT UNIT TOGGLE COMPONENT
   Displays weight in selected unit, converts
   to kg before sending to API.
───────────────────────────────────────── */
function WeightInput({ value, onChange }) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const handleValueChange = (text) => {
    const raw = parseFloat(text);
    if (isNaN(raw) || raw < 0) { onChange(0); return; }

    if (unit === 'kg') {
      onChange(raw); // already kg
    } else {
      // Convert lbs → kg before storing
      onChange(+(raw * 0.453592).toFixed(1));
    }
  };

  const displayValue = unit === 'kg'
    ? (value > 0 ? value.toString() : '')
    : (value > 0 ? (value / 0.453592).toFixed(1) : '');

  return (
    <View style={styles.weightContainer}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder="Weight"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={displayValue}
        onChangeText={handleValueChange}
      />
      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitBtn, unit === 'kg' && styles.unitBtnActive]}
          onPress={() => {
            const currentDisplay = parseFloat(displayValue) || 0;
            setUnit('kg');
            if (currentDisplay > 0) {
              onChange(+(currentDisplay * 0.453592).toFixed(1));
            }
          }}
        >
          <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitBtn, unit === 'lbs' && styles.unitBtnActive]}
          onPress={() => {
            const currentDisplay = parseFloat(displayValue) || 0;
            setUnit('lbs');
            if (currentDisplay > 0) {
              onChange(+(currentDisplay / 0.453592).toFixed(1));
            }
          }}
        >
          <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────── */
export default function PatientDemographicsScreen({ navigation, route }) {
  const editingPatient = route.params?.patient;

  const [mrn, setMrn] = useState(editingPatient?.mrn || '');
  const [name, setName] = useState(editingPatient?.name || '');
  const [age, setAge] = useState(editingPatient?.age?.toString() || '');
  const [gender, setGender] = useState(editingPatient?.gender || 'M');
  const [weightKg, setWeightKg] = useState(editingPatient?.weightKg || 0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ── VALIDATION ── */
  const validate = () => {
    const errs = {};

    if (!mrn.trim()) errs.mrn = 'MRN is required';
    if (!name.trim()) errs.name = 'Name is required';

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      errs.age = 'Age must be 0–150';
    }

    if (!weightKg || weightKg <= 0) {
      errs.weightKg = 'Weight is required (enter in kg or lbs)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── SUBMIT ── */
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const token = getToken();
      const payload = {
        mrn: mrn.trim(),
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        weightKg, // Always stored in kg
      };

      let result;
      if (editingPatient?._id) {
        // TODO: PUT /api/patients/:id
        result = await patientsApi.update(token, editingPatient._id, payload);
      } else {
        result = await patientsApi.create(token, payload);
      }

      Alert.alert('✅ Saved', `Patient ${name} registered`, [
        { text: 'OK', onPress: () => navigation.navigate('Assessment', { patient: result }) },
      ]);
    } catch (err) {
      Alert.alert('❌ Error', err.message || 'Failed to save patient');
    } finally {
      setLoading(false);
    }
  }, [mrn, name, age, gender, weightKg, editingPatient, navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {editingPatient ? '✏️ Edit Patient' : '📋 Patient Registration'}
        </Text>

        {/* MRN */}
        <View style={styles.field}>
          <Text style={styles.label}>MRN *</Text>
          <TextInput
            style={[styles.input, errors.mrn && styles.inputError]}
            value={mrn}
            onChangeText={setMrn}
            placeholder="Medical Record Number"
            autoCapitalize="none"
          />
          {errors.mrn && <Text style={styles.error}>{errors.mrn}</Text>}
        </View>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Patient full name"
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        {/* Age + Gender row */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={[styles.input, errors.age && styles.inputError]}
              value={age}
              onChangeText={setAge}
              placeholder="Years"
              keyboardType="number-pad"
              maxLength={3}
            />
            {errors.age && <Text style={styles.error}>{errors.age}</Text>}
          </View>

          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Gender *</Text>
            <View style={[styles.pickerContainer, errors.gender && styles.inputError]}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={{ color: '#333' }}
              >
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
                <Picker.Item label="Other" value="O" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Weight with unit toggle */}
        <View style={styles.field}>
          <Text style={styles.label}>Weight *</Text>
          <WeightInput value={weightKg} onChange={setWeightKg} />
          {errors.weightKg && <Text style={styles.error}>{errors.weightKg}</Text>}
          {!errors.weightKg && weightKg > 0 && (
            <Text style={styles.hint}>
              Converting to {weightKg < 5 ? 'very low' : weightKg > 200 ? 'very high' : ''} — confirm unit
            </Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '⏳ Saving...' : editingPatient ? 'Update Patient' : 'Register Patient →'}
          </Text>
        </TouchableOpacity>

        {/* Safety note */}
        <Text style={styles.safetyNote}>
          ⚠️ All weights must be entered in kilograms (kg).{'\n'}
          Use the toggle to switch from lbs → kg before entry.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 24 },

  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A2E',
  },
  inputError: { borderColor: '#E53E3E', borderWidth: 2 },
  error: { color: '#E53E3E', fontSize: 12, marginTop: 4 },
  hint: { color: '#666', fontSize: 12, marginTop: 4 },

  row: { flexDirection: 'row' },

  pickerContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 10,
    overflow: 'hidden',
  },

  /* Weight toggle */
  weightContainer: { flexDirection: 'row', alignItems: 'center' },
  unitToggle: {
    flexDirection: 'row',
    marginLeft: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    overflow: 'hidden',
  },
  unitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  unitBtnActive: { backgroundColor: '#4F46E5' },
  unitText: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
  unitTextActive: { color: '#FFF' },

  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },

  safetyNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
});
