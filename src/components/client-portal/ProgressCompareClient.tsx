"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface ProgressPhoto {
  id: number;
  photo_date: string;
  photo_url: string;
  notes: string | null;
}

interface Props {
  photos: ProgressPhoto[];
}

const ProgressCompareClient = ({ photos }: Props) => {
  const [beforePhotoId, setBeforePhotoId] = useState<string>("");
  const [afterPhotoId, setAfterPhotoId] = useState<string>("");

  const beforePhoto = photos.find((p) => p.id.toString() === beforePhotoId);
  const afterPhoto = photos.find((p) => p.id.toString() === afterPhotoId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysDifference = () => {
    if (!beforePhoto || !afterPhoto) return null;
    const before = new Date(beforePhoto.photo_date);
    const after = new Date(afterPhoto.photo_date);
    const diffTime = Math.abs(after.getTime() - before.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (photos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Compare Progress</h1>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No progress photos found. Add some photos to start tracking your
              progress!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Before
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={beforePhotoId} onValueChange={setBeforePhotoId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {photos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id.toString()}>
                    {formatDate(photo.photo_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              After
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={afterPhotoId} onValueChange={setAfterPhotoId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {photos.map((photo) => (
                  <SelectItem key={photo.id} value={photo.id.toString()}>
                    {formatDate(photo.photo_date)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {beforePhoto && afterPhoto && (
        <>
          {calculateDaysDifference() !== null && (
            <Card className="mb-8">
              <CardContent className="py-4">
                <p className="text-center text-lg">
                  <span className="font-semibold">
                    {calculateDaysDifference()} days
                  </span>{" "}
                  of progress
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Before - {formatDate(beforePhoto.photo_date)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
                  <img
                    src={beforePhoto.photo_url}
                    alt={`Progress photo from ${beforePhoto.photo_date}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {beforePhoto.notes && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {beforePhoto.notes}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  After - {formatDate(afterPhoto.photo_date)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden">
                  <img
                    src={afterPhoto.photo_url}
                    alt={`Progress photo from ${afterPhoto.photo_date}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {afterPhoto.notes && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {afterPhoto.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {(!beforePhoto || !afterPhoto) && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Select both before and after dates to compare your progress
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressCompareClient;
