import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import apiClient from '../services/api';
import { ApiResponse, Lieu } from '../types/index';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LieuCard from '../components/LieuCard';
import { RootStackParamList } from '../types/navigation';

export default function LieuListScreen() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'LieuList'>>();

  const filteredLieux = lieux.filter((lieu) =>
    lieu.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const fetchLieux = async (pageNumber: number) => {
    try {
      const response = await apiClient.get<ApiResponse<Lieu>>(
        `/lieu?page=${pageNumber}`
      );

      const newLieux = response.data.results;

      setLieux((prev) =>
        pageNumber === 1 ? newLieux : [...prev, ...newLieux]
      );

      if (response.data.info.next === null) {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchLieux(1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchLieux(page);
    }
  }, [page]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!isLoading && !isFetchingMore && hasMore) {
      setIsFetchingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Chargement...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredLieux}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View>
            <TextInput
              placeholder="Rechercher un lieu..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        }
        renderItem={({ item }) => (
          <LieuCard
            lieu={item}
            onPress={() => navigation.navigate('LieuDetail', { lieu: item })}
          />
        )}
        contentContainerStyle={{ padding: 5 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  footerLoader: {
    marginVertical: 20,
  },
});