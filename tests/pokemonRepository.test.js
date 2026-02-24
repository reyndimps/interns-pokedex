import { jest } from '@jest/globals';

// Mock axios before importing the repository
const mockAxios = {
  get: jest.fn()
};

jest.unstable_mockModule('axios', () => ({
  default: mockAxios
}));

// Import after mocking
const pokemonRepository = await import('../src/repositories/pokemonRepository.js');

describe('Pokemon Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPokemon', () => {
    it('should fetch all pokemon with default pagination', async () => {
      const mockResponse = {
        data: {
          count: 1000,
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
          ]
        }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await pokemonRepository.getAllPokemon();

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon', {
        params: { limit: 20, offset: 0 }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch pokemon with custom pagination', async () => {
      const mockResponse = {
        data: { count: 1000, results: [] }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      await pokemonRepository.getAllPokemon(10, 20);

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon', {
        params: { limit: 10, offset: 20 }
      });
    });

    it('should throw error when API fails', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(pokemonRepository.getAllPokemon()).rejects.toThrow(
        'Failed to fetch Pokemon list'
      );
    });
  });

  describe('getPokemonByNameOrId', () => {
    it('should fetch pokemon by name', async () => {
      const mockPokemon = {
        data: {
          id: 25,
          name: 'pikachu',
          sprites: { front_default: 'sprite.png' }
        }
      };
      mockAxios.get.mockResolvedValue(mockPokemon);

      const result = await pokemonRepository.getPokemonByNameOrId('pikachu');

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
      expect(result).toEqual(mockPokemon.data);
    });

    it('should fetch pokemon by id', async () => {
      const mockPokemon = {
        data: { id: 25, name: 'pikachu' }
      };
      mockAxios.get.mockResolvedValue(mockPokemon);

      const result = await pokemonRepository.getPokemonByNameOrId(25);

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(result).toEqual(mockPokemon.data);
    });

    it('should return null for 404 errors', async () => {
      mockAxios.get.mockRejectedValue({ response: { status: 404 } });

      const result = await pokemonRepository.getPokemonByNameOrId('nonexistent');

      expect(result).toBeNull();
    });

    it('should throw error for other API failures', async () => {
      mockAxios.get.mockRejectedValue(new Error('Server Error'));

      await expect(pokemonRepository.getPokemonByNameOrId('pikachu')).rejects.toThrow(
        'Failed to fetch Pokemon'
      );
    });
  });

  describe('getPokemonSpecies', () => {
    it('should fetch pokemon species', async () => {
      const mockSpecies = {
        data: {
          id: 25,
          name: 'pikachu',
          color: { name: 'yellow' }
        }
      };
      mockAxios.get.mockResolvedValue(mockSpecies);

      const result = await pokemonRepository.getPokemonSpecies('pikachu');

      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon-species/pikachu'
      );
      expect(result).toEqual(mockSpecies.data);
    });

    it('should return null for 404 errors', async () => {
      mockAxios.get.mockRejectedValue({ response: { status: 404 } });

      const result = await pokemonRepository.getPokemonSpecies('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('searchPokemon', () => {
    it('should search and filter pokemon by query', async () => {
      const mockResponse = {
        data: {
          results: [
            { name: 'pikachu', url: 'url1' },
            { name: 'pichu', url: 'url2' },
            { name: 'bulbasaur', url: 'url3' }
          ]
        }
      };
      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await pokemonRepository.searchPokemon('pik');

      expect(result.count).toBe(1);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('pikachu');
    });
  });

  describe('getPokemonTypes', () => {
    it('should fetch all pokemon types', async () => {
      const mockTypes = {
        data: {
          results: [
            { name: 'fire', url: 'url1' },
            { name: 'water', url: 'url2' }
          ]
        }
      };
      mockAxios.get.mockResolvedValue(mockTypes);

      const result = await pokemonRepository.getPokemonTypes();

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type');
      expect(result).toEqual(mockTypes.data.results);
    });
  });

  describe('getPokemonByType', () => {
    it('should fetch pokemon by type', async () => {
      const mockTypeData = {
        data: {
          pokemon: [
            { pokemon: { name: 'charmander', url: 'url1' } },
            { pokemon: { name: 'charmeleon', url: 'url2' } }
          ]
        }
      };
      mockAxios.get.mockResolvedValue(mockTypeData);

      const result = await pokemonRepository.getPokemonByType('fire');

      expect(mockAxios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('charmander');
    });

    it('should return null for 404 errors', async () => {
      mockAxios.get.mockRejectedValue({ response: { status: 404 } });

      const result = await pokemonRepository.getPokemonByType('nonexistent');

      expect(result).toBeNull();
    });
  });
});