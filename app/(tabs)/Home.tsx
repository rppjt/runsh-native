import type { UserInfoResponse } from "@/api";
import type { PopularRecommendedCourseResponse } from "@/api/popularRecommendedCourseResponse";
import { getAllRecommendedCourses } from "@/api/recommended-course/recommended-course";
import type { RecommendedCourseListResponse } from "@/api/recommendedCourseListResponse";
import { getPopularCourses } from "@/api/stats/stats";
import { getUserInfo } from "@/api/user/user";
import MapContainer from "@/components/MapContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Home = () => {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [allCourses, setAllCourses] = useState<RecommendedCourseListResponse[]>([]);
  const [popularCourses, setPopularCourses] = useState<PopularRecommendedCourseResponse[]>([]);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);

  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const userRes = await getUserInfo();
        setUser(userRes.data);

        const recoRes = await getAllRecommendedCourses({ sortType: "LIKE" });
        setAllCourses(recoRes.slice(0, 3));

        const popularRes = await getPopularCourses();
        setPopularCourses(popularRes.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [accessToken]);

  const handleRecover = () => {
    router.push("/recover");
  };

  const handleIgnore = () => {
    setShowRecoveryPrompt(false);
  };

  const handleClickCourse = (id: number) => {
    router.push(`/course/${id}`);
  };

  if (!user) return <Text>사용자 정보를 불러오는 중...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        <Text style={styles.link} onPress={() => router.push("/mypage")}>
          {user.name || user.email}
        </Text>
        님 환영합니다
      </Text>
      <Text>level : {user.level}</Text>

      <MapContainer />

      {showRecoveryPrompt && (
        <View style={styles.recoveryBox}>
          <Text>💾 저장되지 않은 기록이 있습니다. 복구하시겠습니까?</Text>
          <TouchableOpacity onPress={handleRecover}>
            <Text>✅ 복구</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleIgnore}>
            <Text>❌ 무시</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.recommendBox}>
        <Text style={styles.sectionTitle}>📌 추천 경로</Text>
        <ScrollView horizontal contentContainerStyle={styles.recommendList}>
          {allCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseItem} onPress={() => handleClickCourse(course.id!)}>
              <Image source={require("@/assets/course-default-thumbnail.jpg")} style={styles.thumbnail} />
              <Text>{course.endLocationName}</Text>
              <Text>❤️ {course.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => router.push("/courses")}>
          <Text style={styles.moreButton}>➕ 더보기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.popularBox}>
        <Text style={styles.sectionTitle}>🔥 인기 추천 코스</Text>
        <View style={styles.popularGrid}>
          {popularCourses.slice(0, 10).map((course) => (
            <TouchableOpacity
              key={course.courseId}
              style={styles.popularCard}
              onPress={() => handleClickCourse(course.courseId!)}
            >
              <Text style={styles.popularTitle}>{course.courseTitle}</Text>
              <Text style={styles.popularInfo}>
                📏 {course.totalDistance?.toFixed(1)}km | 👥 {course.uniqueRunnerCount}명
              </Text>
              <Text style={styles.popularStats}>
                🔥 {course.totalCompletionCount}회 | ⏱ {course.averagePace}분/km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold" },
  link: { textDecorationLine: "underline", color: "#333" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  recommendBox: { marginTop: 20 },
  recommendList: { flexDirection: "row", gap: 12 },
  courseItem: { alignItems: "center", marginRight: 10 },
  thumbnail: { width: 100, height: 100, borderRadius: 8, resizeMode: "cover" },
  moreButton: { color: "#eab308", marginTop: 10 },
  popularBox: { marginTop: 30 },
  popularGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  popularCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  popularTitle: { fontWeight: "bold" },
  popularInfo: { fontSize: 13 },
  popularStats: { fontSize: 13 },
  recoveryBox: { backgroundColor: "#fef3c7", padding: 12, borderRadius: 8, marginVertical: 10 },
});
