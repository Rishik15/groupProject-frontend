import { useEffect, useRef, useState } from "react";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Label,
  TextArea,
  TimeField,
} from "@heroui/react";
import type { TimeValue } from "@heroui/react";
import { CalendarDate, type DateValue, Time } from "@internationalized/date";
import { Clock3, Image as ImageIcon, Upload, X } from "lucide-react";
import { uploadProgressPhoto } from "../../../services/Setting/progressPhotoService";
import { SUPPORTED_IMAGE_TYPES, buildTakenAtIso, revokeBlobUrl } from "./utils";

type Props = {
  onUploadSuccess: () => Promise<void> | void;
};

const ProgressPhotoUpload = ({ onUploadSuccess }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [takenOn, setTakenOn] = useState<DateValue | null>(null);
  const [takenTime, setTakenTime] = useState<TimeValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetSelection = () => {
    revokeBlobUrl(previewUrl);
    setSelectedFile(null);
    setPreviewUrl("");
    setCaption("");
    setTakenOn(null);
    setTakenTime(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File | null) => {
    setSuccessMessage("");
    setErrorMessage("");
    revokeBlobUrl(previewUrl);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      setSelectedFile(null);
      setPreviewUrl("");
      setErrorMessage("Please upload a JPG, PNG, GIF, or WEBP image.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleNow = () => {
    const current = new Date();

    setTakenOn(
      new CalendarDate(
        current.getFullYear(),
        current.getMonth() + 1,
        current.getDate(),
      ),
    );

    setTakenTime(new Time(current.getHours(), current.getMinutes(), 0));
  };

  const handleCancelUpload = () => {
    setSuccessMessage("");
    resetSelection();
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a photo first.");
      return;
    }

    if ((takenOn && !takenTime) || (!takenOn && takenTime)) {
      setErrorMessage("Select both date and time, or use the Now button.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await uploadProgressPhoto({
        file: selectedFile,
        caption,
        takenAtIso: buildTakenAtIso(takenOn, takenTime),
      });

      resetSelection();
      setSuccessMessage("Progress photo uploaded successfully.");
      await onUploadSuccess();
    } catch (error) {
      console.error("Progress photo upload failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload progress photo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      revokeBlobUrl(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
      />

      {!selectedFile ? (
        <Button
          className="w-fit rounded-md bg-indigo-500 text-sm font-normal"
          onClick={handlePickPhoto}
        >
          <ImageIcon className="h-4 w-4" />
          Upload Progress Photo
        </Button>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-default-200 bg-default-50 p-3">
            <img
              src={previewUrl}
              alt="Progress photo preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-[13.125px] font-medium text-[#0F0F14]">
              Caption
            </label>
            <TextArea
              placeholder="Optional caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="w-full text-[13.125px]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[#0F0F14]">
                Date Taken
              </p>

              <Button
                className="border border-default-200 bg-white text-[#0F0F14]"
                onClick={handleNow}
              >
                <Clock3 className="h-4 w-4" />
                Now
              </Button>
            </div>

            <div className="grid grid-cols-[1.2fr_0.9fr] gap-x-3 gap-y-3">
              <DatePicker
                className="w-full"
                value={takenOn}
                onChange={setTakenOn}
              >
                <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                  Date
                </Label>

                <DateField.Group
                  className="rounded-xl border border-default-200 bg-white"
                  fullWidth
                  variant="secondary"
                >
                  <DateField.Input className="px-3 text-[13.125px]">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>

                  <DateField.Suffix>
                    <DatePicker.Trigger className="px-3">
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>

                <DatePicker.Popover className="rounded-xl p-2">
                  <Calendar aria-label="Progress photo date">
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                        <Calendar.YearPickerTriggerIndicator />
                      </Calendar.YearPickerTrigger>

                      <Calendar.NavButton slot="previous" />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>

                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => (
                          <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                        )}
                      </Calendar.GridHeader>

                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>

                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>

              <TimeField
                className="w-full"
                value={takenTime}
                onChange={setTakenTime}
                granularity="minute"
                hourCycle={12}
              >
                <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                  Time
                </Label>

                <TimeField.Group
                  className="rounded-xl border border-default-200 bg-white"
                  fullWidth
                  variant="secondary"
                >
                  <TimeField.Input className="px-3 text-[13.125px]">
                    {(segment) => <TimeField.Segment segment={segment} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="rounded-md bg-indigo-500 text-sm font-medium"
              onClick={handleConfirmUpload}
              isDisabled={!selectedFile || isSubmitting}
            >
              <Upload className="h-4 w-4" />
              {isSubmitting ? "Uploading..." : "Confirm Upload"}
            </Button>

            <Button
              className="rounded-md border border-gray-300 bg-white text-sm text-black"
              onClick={handleCancelUpload}
              isDisabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancel Upload
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ProgressPhotoUpload;
