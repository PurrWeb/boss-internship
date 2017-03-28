class Base64Image
  EXAMPLE_URI =
'data:image/png;base64,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VmEoBCCAYFEGIACBYAgMCMbSkhj66aeflsKSfv36mdlmm60UtmAEBNpFAMFqgPRnn31m5phjjgZi9F7QxRdf3Lz22mu99wBShkAJCdAkLGGmYBIEIOAnQA3LzwXfkhL45ptvzMsvv+xYN3jwYJrIDpXO80CwOi9PO/qN3n33XbPssss673j77bebzTff3PHHo7MI0CTsrPzkbSDQ0QSoYTWQvRqVmz59egMxvgt68sknmzPPPPM7j29/jRkzxuy+++6Ofz2PmWaaqV4Q7kOg4wggWA1m6SKLLNJgjP8PXm10cZ555jFF0yxkCJEgEDABmoQBZx6mQ6DbCCBY3ZbjvC8EAiaAYAWceZgOgW4jQB9WF+T4J598Ymaeeeb4087X1XNfeeWVeH7UwIEDzdxzz93Ox/OsDiSAYHVYpr711ltm4sSJZsKECWby5MnxqOaHH35o+vfvbxZddFGz5JJLmrXWWsvstddeZv3112/Z20dRZC699FJz6623milTpsSfN954w8g/cbPOOqtZY401zNZbb22GDx+e6/kSvDvuuCNJwnz00UeV3+kfN910UyyOaT89R++M6yACtkDh2kDg2GOP1V+u8xk3blxLnj516tRojz32iKwwOc/wPVd+Q4YMicaOHRt99dVXTdlgJ21Ga6+9du7nJvZsscUW0ZNPPlnz2VdccUXD6SbpW/GsmTY3wyNAH5Yt3aG70047zSy//PLmoosuMlq6ktc999xz5vDDDzcbbrihefrpp/NGq4RTbW7EiBHmBz/4gZk0aVLFP++P2267zay55prm7LPPzhuFcF1OAMEKuADY/4/miCOOMEcffbT5+OOPC7/JI488EjcTJXh53YwZM8ywYcPMddddlzeKN5wE9tBDD0W0vHTwzBKgDytLJKDr/fff35x//vlVLZ5//vnjGsyqq64a9/1MmzbNPPjgg0br8bLuyy+/NPvuu69ZeOGFzVZbbZW97VwffPDB5oknnnD8BwwYYHbYYQezyiqrGG2BowmzL730knnhhRfiz8MPP2w+//xzJ95hhx1mNt10U7Pyyiv3uDfLLLMYvUfiJNISy6xTh76enXYaaMB1GIHwWrFhWtzqPqxzzz23at+O7WyObHPPC8qKRXT11VdHK620kje+/cOPnn32WW/cxPPuu+/2xt1+++0j20meBPN+P//885FtQnrjjxw5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DTbYoGaqL7zwghNH6fzvf/+rxLvlllsiW3C94bLP3HrrraN///vflbjJD1sbiw499NDICkSudKx4RHfddVcSvdD3E088EVnxiawo5Hpm8i6ycYcddoiuvfbayNbACj07HckKVXTIIYdEVoDr2mH/AUSjR4+OrLBXkjj88MOdeFZwKvfz/rACGdl/BpEVJie95N2z30OGDInGjh0bffXVV3kf0xXhTFe8ZS++ZG8J1qmnnhr169cvdwFXgZ9vvvmixx9/vPK2EjAV/OwfQ71rCcdf/vKXSjp5f3z++eexUNVLP8/9zTffPLI1kryPdsLZ2lRka3ANv/siiywSPfDAA3F6rRCsMWPGRLbm1rAdCaN11103euqpp5z361YPBKvJnO8NwTr++OMLF/Alllgisk2ZyDbBCv3BJn8oqpWoppTX2X6YSCKTxG/Ft8RW79Kou+SSS6IBAwYUtmW22WaLa5nNCNY333wT+eIX4TLzzDNHF154YaMYOjI8fVi2BJXJnXvuuea3v/2tY5K2sFFfi/o7rJBU7TC3AmqOPvpoc++998Z9JNmEFF99XwsttFClLysbRtdffPGF+dGPfmRsjc132/H705/+ZO644w7HXx621mLWXHNNs8IKK8SfueaaK+54Vz+a3uX222/XP04n7nPPPRe/i5jkdZdddpnZfffdjRUMbxRba43tWXrppeP+tP/+97/Os7W/2ciRI42t3XjTyOO5//77m/PPP79qUPVBismqq64a56UGIh588MFKH186ojrl1b+38MILm6222ip9q/t+d6QMt/GlWl3DsiWwR81AfTqq6aT7MtS/o+beKqus0iNsNm76euONN47uueeeSH1aaWc78SMrTFX7V3z9Yun4+v3ee+9Fs88+u9eWAw44wHlmNr7tjI/7mtL2Jr/VD6b087hXXnklsp3iXjtsh3Z02mmnRe+//36PpNTPdeutt0ayM3lmre88fVhWYKumpb5GK8Q9bEgu1KS2gwPRSiut5I0/99xzR3bgJQneld80CZvM9t4SLPVH/eMf/6hp3dtvvx3Z/9Lewp380dmaWdwfpSZKLfeLX/zCm85vfvObWtHie7IzeV76245K1o2bDnDYYYd508nTHNL72U0TvfG32267yNaa0o/y/tZz6vU31RMsiZGYpznot4RXglkvH2SYneoQ2VFLJw2lM2rUKK/t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
  '.strip
end
