import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';

const WeatherIcon = ({ weatherCondition, size = 120, style }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;
  const rainAnim = useRef(new Animated.Value(0)).current;
  const snowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations based on weather condition
    if (weatherCondition === 'Clear' || weatherCondition === 'Clouds') {
      // Sun rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: true,
        })
      ).start();
    }

    if (weatherCondition === 'Clouds' || weatherCondition === 'Mist' || weatherCondition === 'Haze' || weatherCondition === 'Fog') {
      // Cloud movement animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(cloudAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(cloudAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }

    if (weatherCondition === 'Rain') {
      // Rain falling animation
      Animated.loop(
        Animated.timing(rainAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ).start();
    }

    if (weatherCondition === 'Snow') {
      // Snow falling animation
      Animated.loop(
        Animated.timing(snowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }

    if (weatherCondition === 'Thunderstorm') {
      // Thunder pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [weatherCondition]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cloudTranslate = cloudAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const rainTranslate = rainAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const snowTranslate = snowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const renderClearWeather = () => (
    <Animated.View
      style={{
        transform: [{ rotate: rotation }],
      }}
    >
      <Image
        source={require('../assets/images/sun.png')}
        style={{
          width: size,
          height: size,
          tintColor: '#FFD700',
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const renderCloudyWeather = () => (
    <View style={{ position: 'relative', width: size, height: size }}>
      {/* Sun behind cloud */}
      <Image
        source={require('../assets/images/sun.png')}
        style={{
          position: 'absolute',
          top: size * 0.1,
          right: size * 0.1,
          width: size * 0.4,
          height: size * 0.4,
          tintColor: '#FFD700',
          opacity: 0.7,
        }}
        resizeMode="contain"
      />
      {/* Cloud in front */}
      <Animated.View
        style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.05,
          transform: [{ translateX: cloudTranslate }],
        }}
      >
        <Image
          source={require('../assets/images/cloud.png')}
          style={{
            width: size * 0.8,
            height: size * 0.6,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );

  const renderPartlyCloudy = () => (
    <Animated.View
      style={{
        transform: [{ translateX: cloudTranslate }],
      }}
    >
      <Image
        source={require('../assets/images/partlycloudy.png')}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const renderRainyWeather = () => (
    <View style={{ position: 'relative', width: size, height: size }}>
      {/* Cloud */}
      <Image
        source={require('../assets/images/cloud.png')}
        style={{
          width: size * 0.8,
          height: size * 0.6,
          position: 'absolute',
          top: size * 0.1,
          left: size * 0.1,
        }}
        resizeMode="contain"
      />
      
      {/* Rain drops using drop icon */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: `${20 + i * 15}%`,
            top: size * 0.4,
            transform: [{ translateY: rainTranslate }],
            opacity: 0.7,
          }}
        >
          <Image
            source={require('../assets/icons/drop.png')}
            style={{
              width: size * 0.08,
              height: size * 0.12,
              tintColor: '#87CEEB',
            }}
            resizeMode="contain"
          />
        </Animated.View>
      ))}
    </View>
  );

  const renderModerateRain = () => (
    <Animated.View
      style={{
        transform: [{ translateX: cloudTranslate }],
      }}
    >
      <Image
        source={require('../assets/images/moderaterain.png')}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const renderHeavyRain = () => (
    <Animated.View
      style={{
        transform: [{ translateX: cloudTranslate }],
      }}
    >
      <Image
        source={require('../assets/images/heavyrain.png')}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const renderMistyWeather = () => (
    <Animated.View
      style={{
        transform: [{ translateX: cloudTranslate }],
      }}
    >
      <Image
        source={require('../assets/images/mist.png')}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );

  const renderThunderstorm = () => (
    <Animated.View style={{ 
      position: 'relative', 
      width: size, 
      height: size, 
      transform: [{ scale: pulseAnim }] 
    }}>
      <Image
        source={require('../assets/images/cloud.png')}
        style={{
          width: size * 0.8,
          height: size * 0.6,
          position: 'absolute',
          top: size * 0.1,
          left: size * 0.1,
        }}
        resizeMode="contain"
      />
      
      {/* Lightning bolt using wind icon as base */}
      <View
        style={{
          position: 'absolute',
          top: size * 0.5,
          left: size * 0.45,
          transform: [{ rotate: '45deg' }],
        }}
      >
        <Image
          source={require('../assets/icons/wind.png')}
          style={{
            width: size * 0.15,
            height: size * 0.3,
            tintColor: '#FFD700',
          }}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );

  const renderSnow = () => (
    <View style={{ position: 'relative', width: size, height: size }}>
      {/* Cloud */}
      <Image
        source={require('../assets/images/cloud.png')}
        style={{
          width: size * 0.8,
          height: size * 0.6,
          position: 'absolute',
          top: size * 0.1,
          left: size * 0.1,
        }}
        resizeMode="contain"
      />
      
      {/* Snowflakes using drop icon */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: `${15 + i * 12}%`,
            top: size * 0.35,
            transform: [{ translateY: snowTranslate }],
            opacity: 0.8,
          }}
        >
          <Image
            source={require('../assets/icons/drop.png')}
            style={{
              width: size * 0.04,
              height: size * 0.04,
              tintColor: 'white',
            }}
            resizeMode="contain"
          />
        </Animated.View>
      ))}
    </View>
  );

  const renderDefault = () => (
    <View
      style={{
        width: size * 0.8,
        height: size * 0.8,
        borderRadius: (size * 0.8) / 2,
        backgroundColor: '#87CEEB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
      }}
    >
      <Image
        source={require('../assets/images/sun.png')}
        style={{
          width: size * 0.4,
          height: size * 0.4,
          tintColor: 'white',
        }}
        resizeMode="contain"
      />
    </View>
  );

  const renderIcon = () => {
    switch (weatherCondition) {
      case 'Clear':
        return renderClearWeather();
      case 'Clouds':
        return renderPartlyCloudy();
      case 'Rain':
        // Determine rain intensity based on description if available
        return renderModerateRain();
      case 'Snow':
        return renderSnow();
      case 'Mist':
      case 'Haze':
      case 'Fog':
        return renderMistyWeather();
      case 'Thunderstorm':
        return renderThunderstorm();
      default:
        return renderDefault();
    }
  };

  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
      {renderIcon()}
    </View>
  );
};

export default WeatherIcon;