'use client';

import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };
  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.01}
      aria-label="Volume"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range className="absolute bg-white rounded-full h-full" />
        <RadixSlider.Thumb
          className="block -translate-y-1 size-3 bg-white shadow-md rounded-full hover:bg-neutral-400 focus:outline-none focus:shadow-2xl"
          aria-label="Volume"
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
